export const Toast = () => {
  return (
    <div id="toast" className="toast">
      <div className="toast-header">
        <span>
          <img src="/logo.png" width={30} alt="" />
          <span id="toast-title">Fristroop Development</span>
        </span>
        <button>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
      <span id="toast-body" className="break-normal w-full">
        this is toasted
      </span>
    </div>
  );
};
