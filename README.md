# Teddy Challenge MVP: Scalable Financial API & Admin Dashboard

> Building a production-bound MVP that stays operational under load requires ruthless prioritization. This document captures the architectural guardrails, CI/CD discipline, and the most contentious scalability decision so new contributors know **why** things are wired the way they are.

## 🔍 Project Overview & Key Decisions

- **Objective:** Implement a secure, scalable, and observable client account service with an asynchronous, write-efficient view counter feeding the Admin Dashboard.
- **Stakeholders:** Growth (fast iteration), Compliance (auditable storage), SRE (operational calm during spikes). Decisions below balance these often conflicting priorities.
- **Key Principles:** Zero trust for ingress traffic, horizontal scaling over premature optimization, and measurable blast radius for each change.

**Monorepo Topology (Nx)**

```
apps/
	backend/account-service      (NestJS + TypeORM + Redis client)
	frontend/admin               (React + Vite + shadcn/ui)
libs/
	shared/api-services          (OpenAPI-ready fetch clients)
	shared/auth                  (Context + guards)
	shared/utils                 (Cross-cutting helpers)
```

> 📌 **Decision memo:** Kept everything inside a single Nx workspace to exploit `nx affected` graph intelligence and enforce shared lint/config consistency. Drawback: contributors must understand Nx commands before touching production paths.

## ☁️ Production Architecture: Scalability & Resilience (AWS)
****

The stack favors managed services to shrink the operational surface area. Each component is picked for autoscaling hooks, native observability, and least-privilege integrations via IAM roles.

| Component | Technology | Rationale (Trade-offs & Security) |
| :--- | :--- | :--- |
| **API Gateway** | AWS API Gateway / Application Load Balancer (ALB) | Provides WAF, HTTPS termination, and unified entry point. Mitigates DDoS risks. |
| **Backend Compute** | **AWS ECS (Fargate)** | Serverless containers. Chosen over EC2 for reduced operational overhead and horizontal scaling based on API load. |
| **Database** | **AWS RDS (PostgreSQL)** | Managed service provides automatic backups, failover (Multi-AZ), and reduced patching effort, ensuring data integrity. |
| **High-Speed Cache** | **AWS ElastiCache (Redis)** | Dedicated managed cache layer to offload the high-volume `view_count` increment operations from the primary DB. |
| **Frontend Hosting** | **AWS S3 + CloudFront** | Static hosting (S3) combined with a global Content Delivery Network (CloudFront) for low latency and high availability of the Admin Dashboard assets. |

> ⚠️ **Critical constraint:** Keep VPC endpoints private—no Redis or Postgres exposure over the public internet. Every subnet is tied to security groups that mirror principle-of-least-privilege.

## ⚙️ CI/CD Strategy: The Dependency Chain

> 💡 **Optimized Performance:** All CI steps use `nx affected` to guarantee that only the code of the project modified (FE or BE) is tested and built, dramatically reducing pipeline execution time and cost.

1. **CI Backend (`ci-backend.yml`):** Executes lint, unit tests, and a production build for `account-service`. Fails fast on type or schema drift before artifacts are produced.
2. **Trigger Event:** A successful merge to `main` emits a `workflow_dispatch` to CD workflows via a scoped PAT stored in GitHub Secrets. This isolates deployment privileges from PR authors.
3. **CD Backend (`cd-backend.yml`):** Authenticates to the container registry, builds the NestJS image, tags it with the commit SHA, and pushes it. ECS task definitions are updated atomically to avoid partial rollouts.
4. **CD Frontend (`cd-frontend.yml`):** Runs a production Vite build, executes `aws s3 sync` to the dashboard bucket, and invalidates CloudFront so operators see the new dashboard within minutes.

> 🔐 **Secrets posture:** GitHub Environments gate deployments with required reviewers and timeouts; AWS credentials are short-lived OIDC tokens rather than long-lived keys.

## 📈 Scalability Deep Dive: The Asynchronous View Counter

**Problem:** Early prototypes wrote `UPDATE clients SET view_count = view_count + 1` on every read. Under bursty traffic this caused lock contention, transaction bloat, and backpressure on unrelated writes.

**Solution:**

1. **Read Path:** `GET /clients/:id` performs the standard DB lookup, then issues an atomic `INCR` on Redis (`client:{id}:view_count`). Reads stay sub-millisecond and linearly scalable with sharded Redis if needed.
2. **Write Path:** A scheduled NestJS job (`@nestjs/schedule`) runs every 5 minutes. It executes `redisClient.getdel(key)` to atomically fetch-and-reset each counter, then pushes batched `UPDATE clients SET view_count = view_count + :delta WHERE id = :id` statements through a single DB transaction.
3. **Observability:** Prometheus scrapes queue depth (Redis keys pending) and job duration to alert when the flush threatens to miss its window.

> **Trade-off Analysis:** This solution favors **read performance** and eventual consistency (the database may lag the cache by up to 5 minutes) over immediate consistency, which is an acceptable trade-off for a view counter metric.

**Result:** DB write pressure drops to predictable, batched bursts, Redis absorbs the hot path, and operations can scale `view_count` tracking independently from the primary CRUD workload.
