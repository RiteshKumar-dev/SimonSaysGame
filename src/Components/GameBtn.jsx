import React, { forwardRef } from "react";

const GameBtn = forwardRef(({ border, bg, onClick, disabled }, ref) => {
  return (
    <button
      className={`${border} ${bg} w-[175px] sm:w-[200px] h-[175px] sm:h-[200px] m-2 duration-200 hover:scale-105`}
      onClick={onClick}
      ref={ref}
      disabled={disabled}
    />
  );
});

export default GameBtn;
