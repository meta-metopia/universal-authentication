import React, { useMemo } from "react";
import ReacrFlow, { Background } from "reactflow";
import "reactflow/dist/style.css";

export default function RegistrationDiagram() {
  const nodes = useMemo(() => {
    return [
      {
        id: "c-1",
        type: "input",
        data: { label: "user-trigger-registration" },
        position: { x: 0, y: 0 },
      },
      {
        id: "c-2",
        data: { label: "start-generating-challenge-request" },
        position: { x: 0, y: 100 },
      },
      {
        id: "c-3",
        data: { label: "challenge-received" },
        position: { x: 0, y: 300 },
      },
      {
        id: "s-1",
        data: { label: "generating-challenge" },
        position: { x: 200, y: 200 },
      },
      {
        id: "s-2",
        data: { label: "store-challenge-in-redis" },
        position: { x: 200, y: 300 },
      },
      {
        id: "c-4",
        data: { label: "end-generating-challenge-request" },
        position: { x: 0, y: 400 },
      },
      {
        id: "c-5",
        data: { label: "start-client-side-registering" },
        position: { x: 0, y: 500 },
      },
      {
        id: "c-6",
        data: { label: "registering-using-passkey" },
        position: { x: 0, y: 600 },
      },
      {
        id: "c-7",
        data: { label: "client-side-credential-generated" },
        position: { x: 0, y: 700 },
      },
      {
        id: "c-8",
        data: { label: "end-client-side-registering" },
        position: { x: 0, y: 800 },
      },
      {
        id: "c-9",
        data: { label: "sent-client-side-credential" },
        position: { x: 0, y: 900 },
      },
      {
        id: "s-3",
        data: { label: "compare-credential-with-challenge" },
        position: { x: 200, y: 1000 },
      },
      {
        id: "c-10",
        data: { label: "received-registration-result" },
        position: { x: 0, y: 1100 },
      },
    ];
  }, []);

  const edges = useMemo(() => {
    return [
      { id: "e1-2", source: "c-1", target: "c-2" },
      { id: "e2-3", source: "c-2", target: "c-3" },
      { id: "e3-4", source: "c-2", target: "s-1", animated: true },
      { id: "e4-5", source: "s-1", target: "s-2" },
      { id: "e5-6", source: "s-2", target: "c-4", animated: true },
      { id: "e6-7", source: "c-3", target: "c-4" },
      { id: "e7-8", source: "c-4", target: "c-5" },
      { id: "e8-9", source: "c-5", target: "c-6" },
      { id: "e9-10", source: "c-6", target: "c-7" },
      { id: "e10-11", source: "c-7", target: "c-8" },
      { id: "e11-12", source: "c-8", target: "c-9" },
      { id: "e12-13", source: "c-9", target: "s-3", animated: true },
      { id: "e13-14", source: "s-3", target: "c-10", animated: true },
      { id: "e14-15", source: "c-9", target: "c-10" },
    ];
  }, []);

  return (
    <div className="h-[1200px] w-full">
      <ReacrFlow
        nodes={nodes}
        edges={edges}
        maxZoom={1}
        panOnDrag={false}
        zoomOnScroll={false}
      >
        <Background />
      </ReacrFlow>
    </div>
  );
}
