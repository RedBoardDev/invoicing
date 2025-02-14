import { ROUTE_PATHS } from "@config/routePaths";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const Forbidden: React.FC = () => {
	const navigate = useNavigate();
	const { idx: historyIndex } = window.history.state;

	return (
		<Result
			status="403"
			title="403 Forbidden"
			subTitle="Sorry, you are not authorized to access this page."
			extra={
				<Button
					type="primary"
					onClick={() =>
						historyIndex === 0
							? navigate(ROUTE_PATHS.public.login)
							: navigate(-1)
					}
				>
					Go Back
				</Button>
			}
		/>
	);
};

export default Forbidden;
