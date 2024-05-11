import { useEffect, useState } from "react";

const SuccessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
);

const SuccessAlert = ({ children }: { children: string }) => (
  <div role="alert" className="alert alert-success">
    <SuccessIcon />
    <span>{children}</span>
  </div>
);

const WarningAlert = ({ children }: { children: string }) => (
  <div role="alert" className="alert alert-warning">
    <WarningIcon />
    <span>{children}</span>
  </div>
);

// const ErrorIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
// );
// 
// const ErrorAlert = ({ children }: { children: string }) => (
//   <div role="alert" className="alert alert-error">
//     <ErrorIcon />
//     <span>{children}</span>
//   </div>
// );

function App() {

  const [startTime, setStartTime] = useState<string>("09:00");
  const [breakStart, setBreakStart] = useState<string>("12:00");
  const [breakEnd, setBreakEnd] = useState<string>("13:00");
  const [endTime, setEndTime] = useState<string>("18:00");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [suggestTime, setSuggestTime] = useState<string>('');

  // フレックスタイムでの勤務時間が8時間を満たしているかを計算する
  // 勤務開始時間と終了時間を受け取り、8時間を満たしているかを返す
  const isWorkingHoursValid = (startTime: string, breakStartTime: string, breakEndTime: string, endTime: string): [boolean, string] => {
    // 勤務開始時間と終了時間をDate型に変換
    const start = new Date(`2000-01-01T${startTime}`)
    const breakStart = new Date(`2000-01-01T${breakStartTime}`)
    const breakEnd = new Date(`2000-01-01T${breakEndTime}`)
    const end = new Date(`2000-01-01T${endTime}`)
    // 勤務時間を計算
    const workingHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60) - (breakEnd.getTime() - breakStart.getTime()) / (1000 * 60 * 60)
    // 不足している勤務時間を計算
    const suggestTime = 8 - workingHours;
    // 不足時間を満たすための勤務終了時間を計算
    const suggestEndTime = new Date(end.getTime() + suggestTime * 60 * 60 * 1000)
    // 勤務時間が8時間以上かどうかを判定、不足時間を18:00で返す
    return [workingHours >= 8, suggestEndTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })]
  }

  useEffect(() => {
    // 勤務開始時間、終了時間が変更されたら、勤務時間を再計算
    const [isValid, suggestTime] = isWorkingHoursValid(startTime, breakStart, breakEnd, endTime)
    setIsValid(isValid)
    setSuggestTime(suggestTime)
  }, [startTime, breakStart, breakEnd, endTime])

  return (
    <>
      {/* TailwindCSS + DaisyUIで勤務開始時間、勤務終了時間の入力欄 */}
      <div className="flex flex-col gap-2">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th></th>
                <th>Suggest</th>
              </tr>
            </thead>
            <tbody>
              {/* Start */}
              <tr>
                <td>Start</td>
                <td>
                  <input id='start-time' className="input" type="time" name="start-time" value={startTime} onChange={(e) => setStartTime(e.target.value)}/>
                </td>
                <td>-</td>
              </tr>
              {/* Break */}
              <tr>
                <td>Break Start <br/>( Work End )</td>
                <td>
                  <input id='break-start' className="input" type="time" name="break-start" value={breakStart} onChange={(e) => setBreakStart(e.target.value)}/>
                </td>
                <td>-</td>
              </tr>
              <tr>
                <td>Break End <br/>( Work Start )</td>
                <td>
                  <input id='break-end' className="input" type="time" name="break-end" value={breakEnd} onChange={(e) => setBreakEnd(e.target.value)}/>
                </td>
                <td>-</td>
              </tr>
              {/* End */}
              <tr>
                <td>End</td>
                <td>
                  <input id='end-time' className="input" type="time" name="end-time" value={endTime} onChange={(e) => setEndTime(e.target.value)}/>
                </td>
                <td>{suggestTime}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {/* Result */}
      {isValid ? (
        <SuccessAlert>Working hours are valid!</SuccessAlert>
      ) : (
        <WarningAlert>Working hours are invalid!</WarningAlert>
      )}
    </>
  )
}

export default App
