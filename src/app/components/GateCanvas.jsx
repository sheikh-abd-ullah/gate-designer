"use client";
import React, { useEffect, useRef } from "react";
import { Canvas, FabricImage, FabricText, Line } from "fabric";

export default function GateCanvas({ cap, type, arch, height, width }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: "white",
    });

    // let zoom = 1;

    // canvas.on("mouse:wheel", (opt) => {
    //   const delta = opt.e.deltaY;
    //   zoom *= delta > 0 ? 0.9 : 1.1;
    //   zoom = Math.max(0.5, Math.min(zoom, 3)); // limits: min 0.5x, max 3x
    //   canvas.setZoom(zoom);
    //   opt.e.preventDefault();
    //   opt.e.stopPropagation();
    // });

    const drawGate = async () => {
      canvas.clear();

      const scale = 10;
      const totalWidth = width;
      const totalHeight = height;

      const startX = 170;
      const startY = 300;

      // Horizontal ruler
      for (let i = 0; i <= (totalWidth/scale)+1; i += 2) {
        const x = startX + i * scale;
        canvas.add(
          new Line([x, startY + 5, x, startY + 10], {
            stroke: "black",
            strokeWidth: 1,
            selectable: false,
          })
        );
        const text = new FabricText(`${i}ft`, {
          left: x - 6,
          top: startY + 12,
          fontSize: 10,
          fill: "black",
          selectable: false,
        });
        canvas.add(text);
      }

      // Vertical ruler
      for (let i = 0; i <= (totalHeight/scale)+1; i += 2) {
        const y = startY - i * scale;
        canvas.add(
          new Line([startX - 10, y, startX - 5, y], {
            stroke: "black",
            strokeWidth: 1,
            selectable: false,
          })
        );
        const text = new FabricText(`${i}ft`, {
          left: startX - 35,
          top: y - 6,
          fontSize: 10,
          fill: "black",
          selectable: false,
        });
        canvas.add(text);
      }

      const doorGap = type === "double" ? 10 : 0;
      const doorWidth = type === "double" ? totalWidth - doorGap : totalWidth;

      const drawBars = async (offsetX, totalWidth) => {
        let barsCount = Math.max(5, Math.floor(totalWidth / 10) + 4);
        if (barsCount % 2 === 0) barsCount += 1;

        const spacing = totalWidth / (barsCount - 1);
        const groupItems = [];
        const midIndex = Math.floor(barsCount / 2);

        const loadCapImage = async (left, top) => {
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

        for (let i = 0; i < barsCount; i++) {
          const x = offsetX + i * spacing;

          let barHeight = totalHeight;

          const isFirstOrLast = i === 0 || i === barsCount - 1;

          if (!isFirstOrLast) {
            if (arch === "pointed") {
              barHeight = i % 2 === 0 ? totalHeight / 1.2 : totalHeight;
            } else if (arch === "upperCurved") {
              const distance = Math.abs(i - midIndex);
              barHeight =
                totalHeight + ((midIndex - distance) * totalHeight) / barsCount;
            } else if (arch === "lowerCurved") {
              const distance = Math.abs(i - midIndex);
              barHeight =
                totalHeight - ((midIndex - distance) * totalHeight) / barsCount;
            }
          }

          const bar = new Line([x, startY, x, startY - barHeight], {
            stroke: "black",
            strokeWidth: 1,
            selectable: false,
          });

          groupItems.push(bar);

          const capImg = await loadCapImage(x - 2, startY - barHeight - 10);
          groupItems.push(capImg);
        }
        

        return groupItems;
      };

      const bars = await drawBars(startX, doorWidth);
      bars.forEach((obj) => canvas.add(obj));

      // Vertical main posts
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

      // Horizontal detail lines
      const mid1 = startY - totalHeight / 5;
      const last = startY;

      if (type === "double") {
        const leftEnd = startX + doorWidth / 2;
        const rightStart = startX + doorWidth / 2 + doorGap;

        // Mid rails
        canvas.add(
          new Line([startX, mid1, leftEnd, mid1], {
            stroke: "gray",
            strokeWidth: 1.5,
          })
        );
        canvas.add(
          new Line([rightStart, mid1, startX + doorWidth, mid1], {
            stroke: "gray",
            strokeWidth: 1.5,
          })
        );

        // Bottom rails
        canvas.add(
          new Line([startX, last, leftEnd, last], {
            stroke: "gray",
            strokeWidth: 1.5,
          })
        );
        canvas.add(
          new Line([rightStart, last, startX + doorWidth, last], {
            stroke: "gray",
            strokeWidth: 1.5,
          })
        );
      } else {
        canvas.add(
          new Line([startX, mid1, startX + totalWidth, mid1], {
            stroke: "gray",
            strokeWidth: 1.5,
          })
        );
        canvas.add(
          new Line([startX, last, startX + totalWidth, last], {
            stroke: "gray",
            strokeWidth: 1.5,
          })
        );
      }

      // Add top cap images
      FabricImage.fromURL(cap.image, {
        crossOrigin: "anonymous",
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
        crossOrigin: "anonymous",
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

      // Auto-zoom and center the drawing
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
