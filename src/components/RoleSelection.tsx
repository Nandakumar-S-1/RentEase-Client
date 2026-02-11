
import { useNavigate } from 'react-router-dom';

const RoleSelection = () => {
    const navigate = useNavigate();

    return (
        <div >
            <h1>Join Rent Ease</h1>
            <p >How would you like to use Rent Ease?</p>

            <div>

                <div style={{backgroundColor:'beige'}} onClick={() => navigate('/register?role=OWNER')}>
                    <div>🏢</div>
                    <h2>I'm a Property Owner</h2>
                    <p >List and manage your rental Properties</p>
                </div>

                <div style={{backgroundColor:'beige'}} onClick={() => navigate('/register?role=TENANT')}>
                    <div>👤</div>
                    <h2>I'm Looking for Rental</h2>
                    <p >Find your Perfect Property to Rent</p>
                </div>
            </div>

            <div>
                <span>Already have an account? </span>
                <button onClick={() => navigate('/login')}>
                    Sign in
                </button>
            </div>
        </div>
    );
};

export default RoleSelection;
