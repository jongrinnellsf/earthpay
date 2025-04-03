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
            <div className="flex flex-col items-center justify-center">
              <p className="mb-2 text-center">
                Built with <HeartIcon className="inline-block h-4 w-4 text-indigo-500" /> by{" "}
                <a
                  href="https://github.com/jongrinnellsf"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  jkg.eth
                </a>
              </p>
              <p className="text-xs text-gray-500">Personal side project</p>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};

