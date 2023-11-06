import moment from "jalali-moment";
moment.locale("fa");
function App() {
  return (
    <>
      <div className="moveable">
        <div className="flex h-screen items-center justify-center ">
          <div className="flex flex-col items-center justify-center  gap-4">
            <div className="select-none  text-gray-600">
              {moment().format("dddd")}
            </div>
            <div className="text-5xl select-none text-gray-600">
              {moment().jDate()}
            </div>
            <div className="flex flex-row gap-3 text-gray-600">
              <div>{moment().jYear()}</div>
              <div>{moment().format("jMMMM")}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
