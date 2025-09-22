export interface BoundaryPoint {
  id: number;
  x: string;
  y: string;
  z: string;
}

export enum AnalysisType {
  NDVI = 'NDVI',
  NDWI = 'NDWI',
}

export interface AnalysisReport {
  title: string;
  content: string;
}