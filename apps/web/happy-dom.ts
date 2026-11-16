import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register({ url: "https://woj.test" });

const { afterEach } = await import("bun:test");
const { cleanup } = await import("@testing-library/react");

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver ??= ResizeObserverStub;
URL.createObjectURL = () => "blob:test";
URL.revokeObjectURL = () => {};

afterEach(cleanup);
