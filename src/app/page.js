// In this Component, We created controls for gate designing that include type, arch, cap, height, and width

"use client";
import React, { useState } from "react";
import GateCanvas from "./components/GateCanvas";
import Image from "next/image";

export default function HomePage() {
  const [type, setType] = useState("single");
  const [arch, setArch] = useState("upperCurved");
  const [heightFeet, setHeightFeet] = useState(10);
  const [heightInches, setHeightInches] = useState(0);
  const [widthFeet, setWidthFeet] = useState(20);
  const [widthInches, setWidthInches] = useState(0);

  const [postCap, setPostCap] = useState({
    label: "Chess",
    value: "chess",
    image: "/images/chess.png",
  });

  const [frameCap, setFrameCap] = useState({
    label: "Wing",
    value: "wing",
    image: "/images/wing.png",
  });

  const [spears, setSpears] = useState({
    label: "Corn",
    value: "corn",
    image: "/images/corn.png",
  });

  const capOptions = [
    { label: "Corn", value: "corn", image: "/images/corn.png" },
    { label: "Chess", value: "chess", image: "/images/chess.png" },
    { label: "Wing", value: "wing", image: "/images/wing.png" },
  ];

  const scale = 10; // 1 foot = 10 pixels

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Gate Designer</h1>

      <GateCanvas
        postCap={postCap}
        frameCap={frameCap}
        spears={spears}
        type={type}
        arch={arch}
        height={(+heightFeet + heightInches / 12) * scale}
        width={(+widthFeet + widthInches / 12) * scale}
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
            <option value="circularCurvedDown">Circular Curved Down</option>
            <option value="circularCurvedUp">Circular Curved Up</option>
            <option value="hybridCurve">Hybrid Curve</option>
          </select>
        </div>

        <div className="mt-4">
          <label className="block font-semibold mb-2">Post Cap Style</label>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2">
            {capOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => setPostCap(option)}
                className={`cursor-pointer border rounded-lg p-2 flex flex-col items-center justify-center transition duration-200 
          ${
            postCap.value === option.value
              ? "border-blue-500 ring-2 ring-blue-300 bg-blue-50"
              : "hover:border-gray-400"
          }`}
              >
                <Image
                  src={option.image}
                  alt={option.label}
                  width={40}
                  height={40}
                  className="mb-2"
                />
                <span className="text-sm text-center">{option.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="block font-semibold mb-2">Frame Cap Style</label>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2">
            {capOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => setFrameCap(option)}
                className={`cursor-pointer border rounded-lg p-2 flex flex-col items-center justify-center transition duration-200 
          ${
            frameCap.value === option.value
              ? "border-blue-500 ring-2 ring-blue-300 bg-blue-50"
              : "hover:border-gray-400"
          }`}
              >
                <Image
                  src={option.image}
                  alt={option.label}
                  width={40}
                  height={40}
                  className="mb-2"
                />
                <span className="text-sm text-center">{option.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="block font-semibold mb-2">Spears Style</label>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2">
            {capOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => setSpears(option)}
                className={`cursor-pointer border rounded-lg p-2 flex flex-col items-center justify-center transition duration-200 
          ${
            spears.value === option.value
              ? "border-blue-500 ring-2 ring-blue-300 bg-blue-50"
              : "hover:border-gray-400"
          }`}
              >
                <Image
                  src={option.image}
                  alt={option.label}
                  width={40}
                  height={40}
                  className="mb-2"
                />
                <span className="text-sm text-center">{option.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:flex sm:flex gap-10 md:mt-4 sm:mt-4 lg:mt-0">
          <div>
            <label className="block font-semibold mb-1">Height</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={heightFeet}
                onChange={(e) => setHeightFeet(parseInt(e.target.value))}
                className="w-20 border rounded px-3 py-2"
                min={0}
                placeholder="ft"
              />
              <input
                type="number"
                value={heightInches}
                onChange={(e) => setHeightInches(parseInt(e.target.value))}
                className="w-20 border rounded px-3 py-2"
                min={0}
                max={11}
                placeholder="in"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-1">Width</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={widthFeet}
                onChange={(e) => setWidthFeet(parseInt(e.target.value))}
                className="w-20 border rounded px-3 py-2"
                min={0}
                placeholder="ft"
              />
              <input
                type="number"
                value={widthInches}
                onChange={(e) => setWidthInches(parseInt(e.target.value))}
                className="w-20 border rounded px-3 py-2"
                min={0}
                max={11}
                placeholder="in"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
