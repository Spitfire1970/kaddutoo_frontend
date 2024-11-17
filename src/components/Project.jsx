import ProjectIframe from "./ProjectIframe";

const Project = ({ url }) => {
  return <ProjectIframe url={`https://spitfire1970.github.io/${url}`} />;
};

export default Project;