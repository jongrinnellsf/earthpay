import React from "react";
import { HeartIcon } from "@heroicons/react/24/outline";

/**
 * Site footer
 */
export const Footer = () => {

  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0">
      <div className="w-full">
        <ul className="menu menu-horizontal w-full">
          <div className="flex justify-center items-center gap-2 text-sm w-full">
            <div className="flex items-center justify-center">
              <p className="text-center">
                Forked with <HeartIcon className="inline-block h-4 w-4 text-indigo-500" /> from{" "}
                <a
                  href="https://github.com/alchemyplatform/scaffold-alchemy"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  Scaffold Alchemy
                </a>{" "}
                <a
                  href="https://docs.alchemy.com/docs/scaffold-alchemy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-gray-500 hover:text-gray-600 transition-colors"
                >
                  (docs)
                </a>. This is a demo app - no real money is involved.
              </p>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};

