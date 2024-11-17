const ProjectIframe = ({ url}) => {
  return (
    <div className="w-[92vw] h-[72vh] max-w-7xl mx-auto p-4 border">
      <iframe
        src={url}
        className="w-full h-full"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default ProjectIframe;