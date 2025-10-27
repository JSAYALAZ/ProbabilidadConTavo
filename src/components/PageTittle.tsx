type propsT = {
  title: string;
  textColor?: string;
};
export default function PageTittle({ title, textColor }: propsT) {
  return (
    <div className="h-10 w-full mx-auto items-center my-3">
      <p
        className={`uppercase text-3xl font-bold ${
          textColor || "text_color"
        } text-center`}
      >
        {title}
      </p>
    </div>
  );
}
