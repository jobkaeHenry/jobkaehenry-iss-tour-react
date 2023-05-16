import animationData from "../assets/astronaut-lottie.json";
import Lottie from "react-lottie";

const AstronautLottie = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  };
  return (
    <Lottie height={400} width={400} options={defaultOptions} />
  )
}

export default AstronautLottie