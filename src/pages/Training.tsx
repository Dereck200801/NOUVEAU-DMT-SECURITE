import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import TrainingCertifications from '../components/TrainingCertifications';
import TrainingsListGrid from '../components/TrainingsListGrid';

const Training: React.FC = () => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold">Formations & Certifications</h1>

    <Tabs defaultValue="certifications" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="certifications">Certifications</TabsTrigger>
        <TabsTrigger value="trainings">Formations</TabsTrigger>
      </TabsList>

      <TabsContent value="certifications">
        <TrainingCertifications />
      </TabsContent>

      <TabsContent value="trainings">
        <TrainingsListGrid />
      </TabsContent>
    </Tabs>
  </div>
);

export default Training; 