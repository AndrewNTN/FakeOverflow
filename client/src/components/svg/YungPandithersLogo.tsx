import { SVGProps } from "react";
const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" {...props}>
    <path
      d="M84.4 93.8V70.6h7.7v30.9H22.6V70.6h7.7v23.2z"
      style={{
        fill: "#bcbbbb",
      }}
    />
    <path
      d="m38.8 68.4 37.8 7.9 1.6-7.6-37.8-7.9-1.6 7.6zm5-18 35 16.3 3.2-7-35-16.4-3.2 7.1zm9.7-17.2 29.7 24.7 4.9-5.9-29.7-24.7-4.9 5.9zm19.2-18.3-6.2 4.6 23 31 6.2-4.6-23-31zM38 86h38.6v-7.7H38V86z"
      style={{
        fill: "#f48023",
      }}
    />
  </svg>
);
export default Logo;
