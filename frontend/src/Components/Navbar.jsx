// import "./App.css";
function Navbar() {
  return (
    <>
      <div className="navbar flex items-center justify-between pl-2 pr-2">
        <h1 className="text-3xl font-bold underline">QuickFill</h1>

        <ul className="flex items-center justify-center gap-5 text-[20px]">
          <li>
            <a href="">Home</a>
          </li>
          <li>
            <a href="">About</a>
          </li>
          <li>
            <a href="">How it Works</a>
          </li>
          <li>
            <a href="">Contact</a>
          </li>
          <li>
            <a href="">Login</a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Navbar;
