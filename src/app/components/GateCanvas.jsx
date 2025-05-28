"use client";
import React, { useEffect, useRef } from "react";
import { Canvas, FabricImage, FabricText, Line } from "fabric";

export default function GateCanvas({
  postCap,
  frameCap,
  spears,
  type,
  arch,
  height,
  width,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: "white",
    });

    const drawGate = async () => {
      canvas.clear();

      const scale = 10;
      const totalWidth = width;
      const totalHeight = height;

      const startX = 170;
      const startY = 300;

      const halfWidth = totalWidth / 2;
      const doorGap = type === "double" ? 10 : 0;
      const leftDoorWidth =
        type === "double" ? halfWidth - doorGap / 2 : totalWidth;

     

      const getArchHeight = (i, barCount, midIndex) => {
        const distance = Math.abs(i - midIndex);
        const maxDrop = totalHeight / 2;

        if (arch === "pointed") {
          return i % 2 === 0 ? totalHeight / 1.2 : totalHeight;
        } else if (arch === "upperCurved") {
          return totalHeight + ((midIndex - distance) * totalHeight) / barCount;
        } else if (arch === "lowerCurved") {
          return totalHeight - ((midIndex - distance) * totalHeight) / barCount;
        } else if (arch === "circularCurvedDown") {
          const angleStep = Math.PI / (barCount - 1);
          const angle = angleStep * i;
          const sinValue = Math.sin(angle);
          const drop = maxDrop * sinValue;
          return totalHeight - drop;
        } else if (arch === "circularCurvedUp") {
          const angleStep = Math.PI / (barCount - 1);
          const angle = angleStep * i;
          const sinValue = Math.sin(angle);
          const rise = maxDrop * sinValue;
          return totalHeight + rise;
        } else if (arch === "hybridCurve") {
          const t = i / (barCount - 1); // normalize 0 to 1

          // Wider bell curve for earlier rise
          const center = 0.5;
          const sigma = 0.18; // lower = wider curve (was 0.066)
          const gaussian = Math.exp(
            -Math.pow(t - center, 2) / (2 * Math.pow(sigma, 2))
          );

          const rise = maxDrop * gaussian;
          return totalHeight + rise;
        }

        
        return totalHeight;
      };

      const loadCapImage = async (left, top, cap) => {
        return new Promise((resolve) => {
          FabricImage.fromURL(cap.image, {
            crossOrigin: "anonymous",
          }).then((img) => {
            img.scaleToWidth(10);
            img.scaleToHeight(10);
            img.set({
              left,
              top,
              selectable: false,
            });
            resolve(img);
          });
        });
      };


      const drawBars = async (
        offsetX,
        barWidth,
        mirror = false,
        archHeights = []
      ) => {
        const groupItems = [];
        const barCount = archHeights.length;
        const spacing = barWidth / (barCount - 1);

        for (let i = 0; i < barCount; i++) {
          const index = mirror ? i : i;
          const x = offsetX + i * spacing;
          const barHeight = archHeights[index];

          const isEdgeBar =
            (type === "single" && (i === 0 || i === barCount - 1)) ||
            (type === "double" && (i === 0 || i === barCount - 1));

          const bar = new Line([x, startY, x, startY - barHeight], {
            stroke: "black",
            strokeWidth: isEdgeBar ? 3 : 1,
            selectable: false,
          });

          groupItems.push(bar);

          // Add cap only for edge bars
          const capImg = await loadCapImage(
            x - 2,
            startY - barHeight - 10,
            isEdgeBar ? frameCap : spears
          );
          groupItems.push(capImg);
        }

        return groupItems;
      };

      const drawRulers = () => {
        for (let i = 0; i <= totalWidth / scale + 1; i += 2) {
          const x = startX + i * scale;
          canvas.add(
            new Line([x, startY + 5, x, startY + 10], {
              stroke: "black",
              strokeWidth: 1,
              selectable: false,
            })
          );
          canvas.add(
            new FabricText(`${i}ft`, {
              left: x - 6,
              top: startY + 12,
              fontSize: 10,
              fill: "black",
              selectable: false,
            })
          );
        }

        for (let i = 0; i <= totalHeight / scale + 1; i += 2) {
          const y = startY - i * scale;
          canvas.add(
            new Line([startX - 10, y, startX - 5, y], {
              stroke: "black",
              strokeWidth: 1,
              selectable: false,
            })
          );
          canvas.add(
            new FabricText(`${i}ft`, {
              left: startX - 35,
              top: y - 6,
              fontSize: 10,
              fill: "black",
              selectable: false,
            })
          );
        }
      };

      drawRulers();

      if (type === "double") {
        const fullBarCount = Math.max(10, Math.floor(totalWidth / 10) + 8);
        const halfBarCount = Math.floor(fullBarCount / 2);
        const midIndex = Math.floor(fullBarCount / 2);

        const archHeights = Array.from({ length: halfBarCount }, (_, i) =>
          getArchHeight(i, fullBarCount, midIndex)
        );
        const mirrorHeights = [...archHeights].reverse();

        const leftBars = await drawBars(
          startX,
          leftDoorWidth,
          false,
          archHeights
        );
        const rightBars = await drawBars(
          startX + leftDoorWidth + doorGap,
          leftDoorWidth,
          true,
          mirrorHeights
        );
        [...leftBars, ...rightBars].forEach((obj) => canvas.add(obj));
      } else {
        const barCount = Math.max(5, Math.floor(totalWidth / 10) + 4);
        const midIndex = Math.floor(barCount / 2);
        const archHeights = Array.from({ length: barCount }, (_, i) =>
          getArchHeight(i, barCount, midIndex)
        );

        const singleBars = await drawBars(
          startX,
          totalWidth,
          false,
          archHeights
        );
        singleBars.forEach((obj) => canvas.add(obj));
      }

      canvas.add(
        new Line([startX - 5, startY, startX - 5, startY - totalHeight], {
          stroke: "black",
          strokeWidth: 4,
          selectable: false,
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
          { stroke: "black", strokeWidth: 4, selectable: false }
        )
      );

      const midY = startY - totalHeight / 5;
      if (type === "double") {
        const leftEnd = startX + leftDoorWidth;
        const rightStart = startX + leftDoorWidth + doorGap;
        canvas.add(
          new Line([startX, midY, leftEnd, midY], {
            stroke: "gray",
            strokeWidth: 1.5,
          })
        );
        canvas.add(
          new Line([rightStart, midY, startX + totalWidth, midY], {
            stroke: "gray",
            strokeWidth: 1.5,
          })
        );
        canvas.add(
          new Line([startX, startY, leftEnd, startY], {
            stroke: "gray",
            strokeWidth: 1.5,
          })
        );
        canvas.add(
          new Line([rightStart, startY, startX + totalWidth, startY], {
            stroke: "gray",
            strokeWidth: 1.5,
          })
        );
      } else {
        canvas.add(
          new Line([startX, midY, startX + totalWidth, midY], {
            stroke: "gray",
            strokeWidth: 1.5,
          })
        );
        canvas.add(
          new Line([startX, startY, startX + totalWidth, startY], {
            stroke: "gray",
            strokeWidth: 1.5,
          })
        );
      }

      [startX - 7, startX + totalWidth + 3].forEach((x) => {
        FabricImage.fromURL(postCap.image, { crossOrigin: "anonymous" }).then(
          (img) => {
            img.scaleToWidth(10);
            img.scaleToHeight(10);
            img.set({
              left: x,
              top: startY - totalHeight - 10,
              selectable: false,
            });
            canvas.add(img);
          }
        );
      });

      const drawingBounds = canvas.getObjects().reduce(
        (bounds, obj) => {
          const objBounds = obj.getBoundingRect();
          bounds.left = Math.min(bounds.left, objBounds.left);
          bounds.top = Math.min(bounds.top, objBounds.top);
          bounds.right = Math.max(
            bounds.right,
            objBounds.left + objBounds.width
          );
          bounds.bottom = Math.max(
            bounds.bottom,
            objBounds.top + objBounds.height
          );
          return bounds;
        },
        { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
      );

      const drawingWidth = drawingBounds.right - drawingBounds.left;
      const drawingHeight = drawingBounds.bottom - drawingBounds.top;

      const scaleX = canvas.getWidth() / (drawingWidth + 40);
      const scaleY = canvas.getHeight() / (drawingHeight + 40);
      const finalZoom = Math.min(scaleX, scaleY);

      canvas.setZoom(finalZoom);
      canvas.viewportTransform[4] =
        (canvas.getWidth() - drawingWidth * finalZoom) / 2 -
        drawingBounds.left * finalZoom;
      canvas.viewportTransform[5] =
        (canvas.getHeight() - drawingHeight * finalZoom) / 2 -
        drawingBounds.top * finalZoom;

      canvas.renderAll();
    };

    drawGate();

    return () => canvas.dispose();
  }, [type, arch, height, width, postCap, frameCap, spears]);

  return (
    <div className="w-full flex justify-center items-start bg-white p-6 shadow-lg border-b-2 border-gray-200">
      <canvas ref={canvasRef} />
    </div>
  );
}
