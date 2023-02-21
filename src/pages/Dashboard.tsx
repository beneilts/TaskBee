import { useOutletContext } from 'react-router-dom';
import { Helmet } from 'react-helmet'

const Dashboard = () => {
    const { user }: any = useOutletContext();
    

    return (
        <>
            <Helmet>
                <title>Dashboard - TaskBee</title>
            </Helmet>

            <div>
                
            </div>
        </>
    );
};

export default Dashboard;
