"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { createPopper, type Instance } from "@popperjs/core";
import { createPortal } from "react-dom";

interface DropdownProps {
  dropdownButton: React.ReactNode;
  dropdownContent: React.ReactNode;
}

// const TableDropdown: React.FC<DropdownProps> = ({
//   dropdownButton,
//   dropdownContent,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const buttonRef = useRef<HTMLDivElement>(null);
//   const contentRef = useRef<HTMLDivElement>(null);
//   const popperInstanceRef = useRef<Instance | null>(null);

//   const close = (event: MouseEvent) => {
//     const target = event.target as Node;
//     if (buttonRef.current && contentRef.current) {
//       const dropdown = buttonRef.current.closest("div");
//       if (dropdown && !dropdown.contains(target)) {
//         setIsOpen(false);
//       }
//     }
//   };

//   const toggle = () => {
//     setIsOpen(!isOpen);
//     if (popperInstanceRef.current) {
//       popperInstanceRef.current.update();
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("click", close);

//     if (buttonRef.current && contentRef.current) {
//       popperInstanceRef.current = createPopper(
//         buttonRef.current,
//         contentRef.current,
//         {
//           placement: "bottom-end",
//           modifiers: [
//             {
//               name: "offset",
//               options: {
//                 offset: [0, 4],
//               },
//             },
//           ],
//         }
//       );
//     }

//     return () => {
//       document.removeEventListener("click", close);
//       if (popperInstanceRef.current) {
//         popperInstanceRef.current.destroy();
//         popperInstanceRef.current = null;
//       }
//     };
//   }, []);

//   return (
//     <div className="">
//       <div onClick={toggle} ref={buttonRef}>
//         {dropdownButton}
//       </div>
//       <div className="z-10" ref={contentRef}>
//         <div
//           style={{ display: isOpen ? "block" : "none" }}
//           className="p-2 bg-white border border-gray-200 rounded-2xl shadow-lg dark:border-gray-800 dark:bg-gray-700 w-40"
//         >
//           <div
//             className="space-y-1"
//             role="menu"
//             aria-orientation="vertical"
//             aria-labelledby="options-menu"
//           >
//             {dropdownContent}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

const TableDropdown: React.FC<DropdownProps> = ({
  dropdownButton,
  dropdownContent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const buttonRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const popperRef = useRef<Instance | null>(null);

  useEffect(() => setMounted(true), []);

  // Create Popper once both nodes exist
  useEffect(() => {
    if (!mounted || !buttonRef.current || !contentRef.current) return;
    popperRef.current = createPopper(buttonRef.current, contentRef.current, {
      placement: "bottom-end",
      strategy: "fixed", // important to ignore ancestor overflow/scroll
      modifiers: [
        { name: "offset", options: { offset: [0, 4] } },
        {
          name: "flip",
          options: { fallbackPlacements: ["top-end", "bottom-start"] },
        },
        {
          name: "preventOverflow",
          options: { boundary: document.body, padding: 8, altAxis: true },
        },
      ],
    });
    return () => {
      popperRef.current?.destroy();
      popperRef.current = null;
    };
  }, [mounted]);

  // Keep position fresh when opening
  useEffect(() => {
    if (isOpen) popperRef.current?.update();
  }, [isOpen]);

  // Close on outside click (check both refs; portal!)
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!buttonRef.current?.contains(t) && !contentRef.current?.contains(t)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <>
      <div onClick={() => setIsOpen((o) => !o)} ref={buttonRef}>
        {dropdownButton}
      </div>

      {mounted &&
        createPortal(
          <div
            ref={contentRef}
            className="z-50" // bump above table/card
            style={{ visibility: isOpen ? "visible" : "hidden" }} // let Popper measure
            role="dialog"
            aria-hidden={!isOpen}
          >
            <div className="p-2 bg-white border border-gray-200 rounded-2xl shadow-lg dark:border-gray-800 dark:bg-gray-700 w-40">
              <div
                className="space-y-1"
                role="menu"
                aria-orientation="vertical"
              >
                {dropdownContent}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default TableDropdown;
