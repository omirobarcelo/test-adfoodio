import React from "react";
import { Link } from "react-router-dom";

export class Menu extends React.Component {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div>
        <span>Menu</span>
        <div>
          <Link to="/order">
            <button>Click</button>
          </Link>
        </div>
      </div>
    );
  }
}
