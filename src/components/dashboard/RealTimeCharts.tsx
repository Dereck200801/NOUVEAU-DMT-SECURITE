import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import type { ChartOptions } from 'chart.js';

interface MissionsByClient {
  labels: string[];
  data: number[];
}

interface Props {
  occupancyData: any; // pre-formatted chart.js data
  missionsByClient: MissionsByClient;
  barOptions: ChartOptions<'bar'>;
  doughnutOptions: ChartOptions<'doughnut'>;
}

const RealTimeCharts: React.FC<Props> = ({
  occupancyData,
  missionsByClient,
  barOptions,
  doughnutOptions,
}) => {
  // Prepare data for doughnut
  const doughnutData = {
    labels: missionsByClient.labels,
    datasets: [
      {
        data: missionsByClient.data,
        backgroundColor: [
          '#134074',
          '#0ea5e9',
          '#16a34a',
          '#8b5cf6',
          '#64748b',
        ],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Vue d'ensemble temps-réel</h2>

      <Tabs defaultValue="occupation" className="flex-1 flex flex-col">
        <TabsList className="mb-4 self-start">
          <TabsTrigger value="occupation">Occupation</TabsTrigger>
          <TabsTrigger value="client">Par client</TabsTrigger>
        </TabsList>

        <TabsContent value="occupation" className="flex-1">
          {occupancyData ? (
            <Bar data={occupancyData} options={barOptions} className="max-h-80" />
          ) : (
            <p className="text-gray-500 text-center">Données non disponibles</p>
          )}
        </TabsContent>

        <TabsContent value="client" className="flex-1">
          {missionsByClient.labels.length > 0 ? (
            <Doughnut data={doughnutData} options={doughnutOptions} className="max-h-80" />
          ) : (
            <p className="text-gray-500 text-center">Données non disponibles</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealTimeCharts; 