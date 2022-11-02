import { BsBoxSeam, BsGear } from "react-icons/bs";
import { MdSignalCellularAlt } from "react-icons/md";
import { Link } from "react-router-dom";
import { AsideStyle } from "./style";

export const AsideBar = () => {
  return (
    <AsideStyle>
      <figure>
        <img
          src="https://pbs.twimg.com/media/ETr0ATXWsAAS1Uz.jpg"
          alt="Imagem do Kirby"
        />
      </figure>

      <nav>
        <Link to="">
          <MdSignalCellularAlt />
        </Link>

        <Link to="">
          <BsBoxSeam />
        </Link>

        <Link to="">
          <BsGear />
        </Link>
      </nav>
    </AsideStyle>
  );
};