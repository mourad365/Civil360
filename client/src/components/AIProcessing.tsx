import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, FileText, CheckCircle, Upload } from "lucide-react";
import type { AiPlanAnalysis } from "@shared/schema";

interface AIProcessingProps {
  analyses: AiPlanAnalysis[];
  onUploadPlan: () => void;
}

export default function AIProcessing({ analyses, onUploadPlan }: AIProcessingProps) {
  const processingAnalyses = analyses.filter(a => a.status === "processing");
  const completedAnalyses = analyses.filter(a => a.status === "completed");

  return (
    <Card className="shadow-sm border border-border">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">IA Analyse de Plans</h2>
            <p className="text-sm text-muted-foreground">Traitement automatique CAO/BIM et extraction de quantités</p>
          </div>
          <Button 
            onClick={onUploadPlan}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="button-upload-plan"
          >
            <Upload className="mr-2 h-4 w-4" />
            Nouveau Plan
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Processing Plans */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Plans en Traitement</h3>
            
            {processingAnalyses.map((analysis) => (
              <div key={analysis.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                      <FileText className="text-blue-600 dark:text-blue-400 h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{analysis.fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        Format {analysis.fileType?.toUpperCase()} • {((analysis.fileSize || 0) / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Extraction quantités</span>
                    <span className="text-blue-600">{analysis.progress}%</span>
                  </div>
                  <Progress value={analysis.progress || 0} className="w-full" />
                </div>
                {analysis.extractedData && (
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <Brain className="inline mr-2 h-4 w-4" />
                      IA détectée: {JSON.stringify(analysis.extractedData).includes('elements') 
                        ? `${(analysis.extractedData as any).elements} éléments structurels` 
                        : 'Analyse en cours...'}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {processingAnalyses.length === 0 && (
              <div className="border border-dashed border-border rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun plan en traitement</p>
              </div>
            )}
          </div>

          {/* Completed Plans */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Plans Analysés</h3>
            
            {completedAnalyses.slice(0, 3).map((analysis) => (
              <div key={analysis.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                      <CheckCircle className="text-green-600 dark:text-green-400 h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{analysis.fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        Format {analysis.fileType?.toUpperCase()} • {((analysis.fileSize || 0) / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                    Terminé
                  </span>
                </div>
                {analysis.extractedData && (
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Béton:</span>
                        <span className="ml-2 font-medium text-foreground">
                          {(analysis.extractedData as any)?.concrete || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Acier:</span>
                        <span className="ml-2 font-medium text-foreground">
                          {(analysis.extractedData as any)?.steel || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Coffrage:</span>
                        <span className="ml-2 font-medium text-foreground">
                          {(analysis.extractedData as any)?.formwork || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Confiance IA:</span>
                        <span className="ml-2 font-medium text-green-600">
                          {analysis.aiConfidence ? `${(parseFloat(analysis.aiConfidence) * 100).toFixed(1)}%` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {completedAnalyses.length === 0 && (
              <div className="border border-dashed border-border rounded-lg p-8 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun plan analysé</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
