"use client";
export default function Header() {
  return (
    <div className="w-full  bg-foreground  p-4 text-background fixed top-0 h-16">
      <div className="flex gap-1 font-thin items-center">
        <div className="aspect-square bg-background text-foreground w-8 h-8 text-center flex justify-center items-center font-bold text-2xl">
          /
        </div>
        <p className="leading-4">
          Bookleaf <br /> Publishing
        </p>
      </div>
      <div></div>
    </div>
  );
}
