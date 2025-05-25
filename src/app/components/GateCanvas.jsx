// In this Component, We created canvas where design can be seen and gate can be designed

"use client";
import React, { useEffect, useRef } from "react";
import { Canvas, FabricImage, Line } from "fabric";

export default function GateCanvas({ cap, type, arch, height, width }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: "white",
    });

    const drawGate = () => {
      canvas.clear();

      const startX = 100;
      const startY = 300;
      const totalWidth = width;
      const totalHeight = height;

      const doorGap = type === "double" ? 10 : 0;
      const doorWidth =
        type === "double" ? (totalWidth - doorGap) / 2 : totalWidth;

      const drawDoor = (offsetX) => {
        const barsPerDoor = 11;
        const spacing = doorWidth / (barsPerDoor - 1);
        const groupItems = [];

        if (arch === "pointed") {
          for (let i = 0; i < barsPerDoor; i++) {
            const x = offsetX + i * spacing;
            const line = new Line(
              [
                x,
                startY,
                x,
                startY - ((i + 1) % 2 === 0 ? totalHeight / 1.2 : totalHeight),
              ],
              {
                stroke: "black",
                strokeWidth: 2,
              }
            );
            groupItems.push(line);
          }
        } else if (arch === "upperCurved") {
          for (let i = 0; i < barsPerDoor; i++) {
            const x = offsetX + i * spacing;
            const line = new Line(
              [
                x,
                startY,
                x,
                startY -
                  (i < 5
                    ? totalHeight + (i * totalHeight) / 10
                    : i > 5
                    ? totalHeight + ((barsPerDoor - (i + 1)) * totalHeight) / 10
                    : totalHeight + (4 * totalHeight) / 10),
              ],
              {
                stroke: "black",
                strokeWidth: 2,
              }
            );
            groupItems.push(line);
          }
        } else if (arch === "lowerCurved") {
          for (let i = 0; i < barsPerDoor; i++) {
            const x = offsetX + i * spacing;
            const line = new Line(
              [
                x,
                startY,
                x,
                startY -
                  (i < 5
                    ? ((barsPerDoor - (i + 1)) * totalHeight) / 10
                    : i > 5
                    ? (i * totalHeight) / 10
                    : (4 * totalHeight) / 10),
              ],
              {
                stroke: "black",
                strokeWidth: 2,
              }
            );
            groupItems.push(line);
          }
        }

        return groupItems;
      };

      const leftDoor = drawDoor(startX);
      leftDoor.forEach((obj) => canvas.add(obj));

      if (type === "double") {
        const rightStart = startX + doorWidth + doorGap;
        const rightDoor = drawDoor(rightStart);
        rightDoor.forEach((obj) => canvas.add(obj));
      }

      canvas.add(
        new Line([startX - 5, startY, startX - 5, startY - totalHeight], {
          stroke: "black",
          strokeWidth: 4,
        })
      );
      canvas.add(
        new Line(
          [
            startX + totalWidth + 5,
            startY,
            startX + totalWidth + 5,
            startY - totalHeight,
          ],
          { stroke: "black", strokeWidth: 4 }
        )
      );

      canvas.add(
        new Line([startX, startY, startX + totalWidth, startY], {
          stroke: "black",
          strokeWidth: 3,
        })
      );
      //   canvas.add(
      //     new Line(
      //       [
      //         startX,
      //         startY - totalHeight,
      //         startX + totalWidth,
      //         startY - totalHeight,
      //       ],
      //       {
      //         stroke: "black",
      //         strokeWidth: 3,
      //       }
      //     )
      //   );

      const mid1 = startY - totalHeight / 5;
      const mid2 = startY - totalHeight / 7;

      if (type === "double") {
        const doorWidth = (totalWidth - doorGap) / 2;

        canvas.add(
          new Line([startX, mid1, startX + doorWidth, mid1], {
            stroke: "gray",
            strokeWidth: 1.5,
          })
        );
        canvas.add(
          new Line(
            [startX + doorWidth + doorGap, mid1, startX + totalWidth, mid1],
            {
              stroke: "gray",
              strokeWidth: 1.5,
            }
          )
        );

        canvas.add(
          new Line([startX, mid2, startX + doorWidth, mid2], {
            stroke: "gray",
            strokeWidth: 1.5,
          })
        );
        canvas.add(
          new Line(
            [startX + doorWidth + doorGap, mid2, startX + totalWidth, mid2],
            {
              stroke: "gray",
              strokeWidth: 1.5,
            }
          )
        );
      } else {
        canvas.add(
          new Line([startX, mid1, startX + totalWidth, mid1], {
            stroke: "gray",
            strokeWidth: 1.5,
          })
        );
        canvas.add(
          new Line([startX, mid2, startX + totalWidth, mid2], {
            stroke: "gray",
            strokeWidth: 1.5,
          })
        );
      }

      FabricImage.fromURL(cap.image, {
        crossOrigin: "anonymous", // allow external images if needed
      }).then((img) => {
        img.scaleToWidth(10);
        img.scaleToHeight(10);
        img.set({
          left: startX - 7,
          top: startY - totalHeight - 10,
          selectable: false,
        });

        canvas.add(img);
      });

      FabricImage.fromURL(cap.image, {
        crossOrigin: "anonymous", // allow external images if needed
      }).then((img) => {
        img.scaleToWidth(10);
        img.scaleToHeight(10);
        img.set({
          left: startX + totalWidth + 3,
          top: startY - totalHeight - 10,
          selectable: false,
        });

        canvas.add(img);
      });
    };

    drawGate();

    return () => {
      canvas.dispose();
    };
  }, [type, arch, height, width, cap]);

  return (
    <div className="w-full flex justify-center items-start bg-white p-6 shadow-lg border-b-2 border-gray-200">
      <canvas ref={canvasRef} />
    </div>
  );
}
