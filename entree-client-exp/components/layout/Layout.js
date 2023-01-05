// Layout component

import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div>
      <Navbar></Navbar>
      {children}
    </div>
  );
}
