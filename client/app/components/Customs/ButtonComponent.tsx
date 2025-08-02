import React from "react";

type ButtonComponentProps = React.ComponentProps<"button"> & {
  containerClassName?: string;
  showWrapper?: boolean;
};

export function ButtonComponent({
  children = "Ver todos los productos",
  containerClassName = "flex justify-center",
  showWrapper = true,
  ...buttonProps
}: ButtonComponentProps) {
  const buttonElement = (
    <button
      className="rounded-lg p-5 mt-3 bg-[#DB4444] text-white select-none cursor-pointer hover:bg-[#ff9191]"
      {...buttonProps}
    >
      {children}
    </button>
  );

  return showWrapper ? (
    <div className={containerClassName}>{buttonElement}</div>
  ) : (
    buttonElement
  );
}
