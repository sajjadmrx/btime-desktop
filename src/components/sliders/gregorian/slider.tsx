import moment from "jalali-moment";

interface Prop {
  currentTime: moment.Moment;
}

export function GregorianSlider(prop: Prop) {
  const { currentTime } = prop;
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="select-none  text-gray-600  dark:text-[#eee]  font-[balooTamma]">
          {currentTime.locale("en").format("dddd")}
        </div>
        <div className="text-6xl select-none  text-gray-600  dark:text-[#eee] font-[balooTamma]">
          {currentTime.locale("en").date()}
        </div>
        <div className="flex flex-row gap-3  text-gray-600  dark:text-[#eee] font-[balooTamma]">
          <div>{currentTime.locale("en").year()}</div>
          <div>{currentTime.locale("en").format("MMMM")}</div>
        </div>
      </div>
    </div>
  );
}
