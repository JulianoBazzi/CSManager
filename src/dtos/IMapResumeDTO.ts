/* eslint-disable camelcase */
interface IMapResumeDTO {
  id?: string;
  map_type: string;
  name: string;
  link?: string;
  selected_date?: Date;
  team_start_from_terrorist: number;
}

export default IMapResumeDTO;
