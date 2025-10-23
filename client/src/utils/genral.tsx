import { Link } from "react-router-dom";

export const getLink = ({
  path,
  label,
}: {
  path?: string;
  label: string;
}): React.ReactNode => {
  return (
    <Link to={path ?? ""} className="text-lg">
      {label}
    </Link>
  );
};
