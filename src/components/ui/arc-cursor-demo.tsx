"use client";

import React from "react";
import ArcCursor from "@/components/ui/arc-cursor";

export default function ArcCursorDemo() {
  return (
    <div className="relative w-full h-[360px] bg-[#0c080d] rounded-2xl flex items-center justify-center overflow-hidden border border-white/10">
      <ArcCursor colors={["#E77C92", "#FFC0CB", "#FFFFFF"]} strands={3} />
      <div className="text-center space-y-2 select-none z-10 pointer-events-none">
        <h3 className="font-serif text-2xl text-[#FAF4F0]">Electric Arc Cursor</h3>
        <p className="text-xs text-white/60">Di chuyển chuột để trải nghiệm vệt hồ quang điện phát sáng</p>
      </div>
    </div>
  );
}
