export default function Modal(props: {
  open: boolean;
  onClose: Function;

  children: any;
}) {
  return (
    <div
      onClick={(e) => e.stopPropagation}
      className={`fixed inset-0 flex justify-center items-center transition-colors 
                  ${props.open ? "visible bg-black/20" : "invisible"}`}
    >
      <div className={`bg-white rounded-xl shadow p-6 transition-all
      ${props.open ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}>
        <button
          className="absolute top-2 right-2 p-1 text-gray-400 "
          onClick={() => {
            props.onClose();
          }}
        >
          X
        </button>

        {props.children}
      </div>
    </div>
  );
}
