import { Link } from 'react-router-dom';
import StateMessage from '../components/StateMessage';

export default function NotFoundPage() {
  return (
    <div className="text-center">
      <StateMessage title="Page not found" message="That address doesn't match anything in this app." />
      <Link to="/" className="font-medium underline">
        Back to movies
      </Link>
    </div>
  );
}
