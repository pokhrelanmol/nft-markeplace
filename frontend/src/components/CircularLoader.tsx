const CircularLoader = () => {
    return (
        <div className="flex justify-center items-center  ">
            Loading
            <div className="animate-spin rounded-full h-8 w-12 border-t-4 border-b-4  border-red-600" />
        </div>
    );
};
export default CircularLoader;
