import moment from "jalali-moment";

interface Prop {
  currentTime: moment.Moment;
}
export function JalaliSlider(prop: Prop) {
  const { currentTime } = prop;
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="select-none text-gray-600">
          {currentTime.locale("fa").format("dddd")}
        </div>
        <div className="text-6xl select-none text-gray-600">
          {currentTime.locale("fa").jDate()}
        </div>
        <div className="flex flex-row gap-3 text-gray-600">
          <div>{currentTime.locale("fa").jYear()}</div>
          <div>{currentTime.locale("fa").format("jMMMM")}</div>
        </div>
      </div>
    </div>
  );
}
