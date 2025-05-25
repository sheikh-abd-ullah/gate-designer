// In this Component, We created controls for gate designing that include type, arch, cap, height, and width

"use client";
import React, { useState } from "react";
import GateCanvas from "./components/GateCanvas";
import corn from "../images/corn.png";
import chess from "../images/chess.png";
import wing from "../images/wing.png";
import Image from "next/image";

export default function HomePage() {
  const [type, setType] = useState("single");
  const [arch, setArch] = useState("upperCurved");
  const [height, setHeight] = useState(100);
  const [width, setWidth] = useState(200);
  const [open, setOpen] = useState(false);

  const [cap, setCap] = useState({
    label: "Chess",
    value: "chess",
    image: chess.src,
  });

  const capOptions = [
    { label: "Corn", value: "corn", image: corn.src },
    { label: "Chess", value: "chess", image: chess.src },
    { label: "Wing", value: "wing", image: wing.src },
  ];

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Gate Designer</h1>

      <GateCanvas
        cap={cap}
        type={type}
        arch={arch}
        height={height}
        width={width}
      />

      <div className="mt-8 w-full bg-white p-6 rounded shadow lg:flex lg:justify-between">
        <div>
          <label className="block font-semibold mb-1">Gate Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="single">Single Door</option>
            <option value="double">Double Door</option>
          </select>
        </div>

        <div className="md:mt-4 sm:mt-4 lg:mt-0">
          <label className="block font-semibold mb-1">Arch Style</label>
          <select
            value={arch}
            onChange={(e) => setArch(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="upperCurved">Upper Curved</option>
            <option value="pointed">Pointed</option>
            <option value="lowerCurved">Lower Curved</option>
          </select>
        </div>

        <div className="relative lg:w-32 md:mt-4 sm:mt-4 lg:mt-0">
          <label className="block font-semibold mb-1">Cap Style</label>
          <div
            className="border rounded px-3 py-2 bg-white cursor-pointer flex items-center justify-between"
            onClick={() => setOpen(!open)}
          >
            <div className="flex items-center gap-2">
              <Image src={cap.image} alt={cap.label} width={10} height={10} />
              <span>{cap.label}</span>
            </div>
            <span>▼</span>
          </div>

          {open && (
            <div className="absolute z-10 bg-white border mt-1 rounded shadow w-full max-h-60 overflow-auto">
              {capOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    setCap(option);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <Image
                    src={option.image}
                    alt={option.label}
                    width={10}
                    height={10}
                  />
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:flex sm:flex gap-10 md:mt-4 sm:mt-4 lg:mt-0">
          <div>
            <label className="block font-semibold mb-1">Height</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value))}
              className="lg:w-20 border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Width</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value))}
              className="lg:w-20 border rounded px-3 py-2"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
