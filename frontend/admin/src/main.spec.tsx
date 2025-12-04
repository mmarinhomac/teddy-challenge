import { StrictMode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const AppMock = () => null;
const renderMock = vi.fn();
const createRootMock = vi.fn(() => ({ render: renderMock }));

vi.mock('./app', () => ({
  default: AppMock,
}));

vi.mock('react-dom/client', () => ({
  createRoot: createRootMock,
}));

describe('main entrypoint', () => {
  beforeEach(() => {
    renderMock.mockClear();
    createRootMock.mockClear();
    document.body.innerHTML = '<div id="root"></div>';
  });

  it('initializes the app inside StrictMode', async () => {
    await import('./main');

    const rootElement = document.getElementById('root');

    expect(createRootMock).toHaveBeenCalledWith(rootElement);
    expect(renderMock).toHaveBeenCalledTimes(1);

    const renderedTree = renderMock.mock.calls[0][0];

    expect(renderedTree.type).toBe(StrictMode);
    expect(renderedTree.props.children.type).toBe(AppMock);
  });
});
