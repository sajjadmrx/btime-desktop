import React from 'react'

const EmojiWithText = ({ emoji, text }) => (
  <li className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
    <span className="dark:text-white text-gray-600">{text}</span>
    <span className="text-2xl">{emoji}</span>
  </li>
)

const Button = ({ primary, children, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full ${primary ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'} text-white font-bold py-2 px-4 rounded`}
  >
    {children}
  </button>
)

const UpdateList = ({ date, version, updates, last }) => (
  <div
    className="dark:bg-gray-700 bg-gray-100 
  rounded-lg p-4 relative"
  >
    {last && (
      <div className="absolute top-3 right-0 bg-green-500 text-white px-2 py-1 rounded-bl-lg rounded-tr-lg"></div>
    )}
    <p
      className="dark:text-white text-gray-700 text-right font-bold mb-2"
      dir="rtl"
    >
      (نسخه {version}) {date}
    </p>
    <ul className="space-y-2 text-right">
      {updates.map((update, index) => (
        <EmojiWithText key={index} emoji={update.emoji} text={update.text} />
      ))}
    </ul>
  </div>
)

const UpdateModal = ({ onClick }) => {
  interface Update {
    date: string
    version: string //import.meta.env.PACKAGE_VERSION,
    last: boolean
    updates: {
      emoji: string
      text: string
    }[]
  }
  const updateDetails: Update[] = []

  return (
    <div className="fixed z-50 inset-0 bg-opacity-50 flex items-center justify-center p-4 bg-black">
      <div
        className="dark:bg-gray-800 bg-white
       rounded-lg max-w-md w-full p-6 space-y-4 h-full overflow-y-clip"
      >
        <div className="flex items-center justify-center space-x-2 text-blue-400">
          <span className="text-3xl">🎉</span>
          <h2 className="text-xl font-bold">بروز رسانی جدید نصب شد</h2>
        </div>
        <div
          className="dark:bg-gray-700 bg-gray-100
         rounded-lg p-4 max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-600"
        >
          {updateDetails.map((update, index) => (
            <UpdateList
              key={index}
              date={update.date}
              version={update.version}
              updates={update.updates}
              last={update.last}
            />
          ))}
        </div>
        <div className="space-y-2">
          <Button primary={false} onClick={onClick}>
            باشه
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UpdateModal
