
const AnimatedGradient = () => {
  return (
    <div className="fixed inset-0 -z-10 opacity-30">
      <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-purple-300/30 via-blue-300/30 to-pink-300/30" />
      <div className="absolute inset-0 backdrop-blur-[100px]" />
    </div>
  );
};

export default AnimatedGradient;
