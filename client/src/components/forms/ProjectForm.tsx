import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { api } from "@/lib/api";
import {
  Building2,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Plus,
  Trash2,
  Save,
  X
} from "lucide-react";

interface ProjectFormData {
  name: string;
  code: string;
  description: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  client: {
    name: string;
    contact: string;
    email: string;
    phone: string;
  };
  status: string;
  priority: string;
  dates: {
    startDate: string;
    endDate: string;
  };
  budget: {
    estimated: number;
    labor: number;
    materials: number;
    equipment: number;
    contingency: number;
  };
  structure: Array<{
    level: number;
    name: string;
    type: string;
    surface: number;
    height: number;
    slabThickness: number;
    specifications: string;
  }>;
  phases: Array<{
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    duration: number;
  }>;
}

interface ProjectFormProps {
  project?: any;
  onSave: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function ProjectForm({ project, onSave, onCancel, loading }: ProjectFormProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("general");
  const [structureLevels, setStructureLevels] = useState<ProjectFormData['structure']>([]);
  const [phases, setPhases] = useState<ProjectFormData['phases']>([]);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<ProjectFormData>({
    defaultValues: {
      name: '',
      code: '',
      description: '',
      location: {
        address: '',
        coordinates: { lat: 0, lng: 0 }
      },
      client: {
        name: '',
        contact: '',
        email: '',
        phone: ''
      },
      status: 'planning',
      priority: 'medium',
      dates: {
        startDate: '',
        endDate: ''
      },
      budget: {
        estimated: 0,
        labor: 0,
        materials: 0,
        equipment: 0,
        contingency: 0
      },
      structure: [],
      phases: []
    }
  });

  useEffect(() => {
    if (project) {
      // Populate form with existing project data
      reset({
        name: project.name || '',
        code: project.code || '',
        description: project.description || '',
        location: project.location || { address: '', coordinates: { lat: 0, lng: 0 } },
        client: project.client || { name: '', contact: '', email: '', phone: '' },
        status: project.status || 'planning',
        priority: project.priority || 'medium',
        dates: {
          startDate: project.dates?.startDate ? new Date(project.dates.startDate).toISOString().split('T')[0] : '',
          endDate: project.dates?.endDate ? new Date(project.dates.endDate).toISOString().split('T')[0] : ''
        },
        budget: project.budget || { estimated: 0, labor: 0, materials: 0, equipment: 0, contingency: 0 },
        structure: project.structure || [],
        phases: project.phases || []
      });
      
      setStructureLevels(project.structure || []);
      setPhases(project.phases || []);
    }
  }, [project, reset]);

  const addStructureLevel = () => {
    const newLevel = {
      level: structureLevels.length + 1,
      name: `Niveau ${structureLevels.length + 1}`,
      type: 'floor',
      surface: 0,
      height: 0,
      slabThickness: 0,
      specifications: ''
    };
    setStructureLevels([...structureLevels, newLevel]);
  };

  const removeStructureLevel = (index: number) => {
    setStructureLevels(structureLevels.filter((_, i) => i !== index));
  };

  const updateStructureLevel = (index: number, field: string, value: any) => {
    const updated = structureLevels.map((level, i) => 
      i === index ? { ...level, [field]: value } : level
    );
    setStructureLevels(updated);
  };

  const addPhase = () => {
    const newPhase = {
      name: `Phase ${phases.length + 1}`,
      description: '',
      startDate: '',
      endDate: '',
      duration: 0
    };
    setPhases([...phases, newPhase]);
  };

  const removePhase = (index: number) => {
    setPhases(phases.filter((_, i) => i !== index));
  };

  const updatePhase = (index: number, field: string, value: any) => {
    const updated = phases.map((phase, i) => 
      i === index ? { ...phase, [field]: value } : phase
    );
    setPhases(updated);
  };

  const onSubmit = async (data: ProjectFormData) => {
    const formattedData = {
      ...data,
      structure: structureLevels,
      phases: phases.map(phase => ({
        ...phase,
        duration: phase.duration || Math.ceil(
          (new Date(phase.endDate).getTime() - new Date(phase.startDate).getTime()) / (1000 * 60 * 60 * 24)
        )
      }))
    };
    
    await onSave(formattedData);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6 text-blue-400" />
          {project ? 'Modifier le Projet' : 'Créer un Nouveau Projet'}
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="client">Client</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="phases">Phases</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-400" />
                    Informations Projet
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom du Projet *</Label>
                    <Input
                      id="name"
                      {...register("name", { required: "Le nom est requis" })}
                      className="mt-1"
                      placeholder="Ex: Résidence Al Andalus"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="code">Code Projet *</Label>
                    <Input
                      id="code"
                      {...register("code", { required: "Le code est requis" })}
                      className="mt-1"
                      placeholder="Ex: RES-2024-001"
                    />
                    {errors.code && (
                      <p className="text-sm text-red-400 mt-1">{errors.code.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status">Statut</Label>
                      <Select onValueChange={(value) => setValue("status", value)} defaultValue="planning">
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planning">En planification</SelectItem>
                          <SelectItem value="in_progress">En cours</SelectItem>
                          <SelectItem value="on_hold">En attente</SelectItem>
                          <SelectItem value="completed">Terminé</SelectItem>
                          <SelectItem value="cancelled">Annulé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="priority">Priorité</Label>
                      <Select onValueChange={(value) => setValue("priority", value)} defaultValue="medium">
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Sélectionner une priorité" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Faible</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="high">Élevée</SelectItem>
                          <SelectItem value="critical">Critique</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      className="mt-1"
                      rows={4}
                      placeholder="Description détaillée du projet..."
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-400" />
                    Localisation & Planning
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="location.address">Adresse *</Label>
                    <Input
                      id="location.address"
                      {...register("location.address", { required: "L'adresse est requise" })}
                      className="mt-1"
                      placeholder="Adresse complète du chantier"
                    />
                    {errors.location?.address && (
                      <p className="text-sm text-red-400 mt-1">{errors.location.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location.coordinates.lat">Latitude</Label>
                      <Input
                        id="location.coordinates.lat"
                        type="number"
                        step="any"
                        {...register("location.coordinates.lat", { valueAsNumber: true })}
                        className="mt-1"
                        placeholder="33.5731"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location.coordinates.lng">Longitude</Label>
                      <Input
                        id="location.coordinates.lng"
                        type="number"
                        step="any"
                        {...register("location.coordinates.lng", { valueAsNumber: true })}
                        className="mt-1"
                        placeholder="-7.5898"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dates.startDate">Date de Début *</Label>
                      <Input
                        id="dates.startDate"
                        type="date"
                        {...register("dates.startDate", { required: "La date de début est requise" })}
                        className="mt-1"
                      />
                      {errors.dates?.startDate && (
                        <p className="text-sm text-red-400 mt-1">{errors.dates.startDate.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="dates.endDate">Date de Fin *</Label>
                      <Input
                        id="dates.endDate"
                        type="date"
                        {...register("dates.endDate", { required: "La date de fin est requise" })}
                        className="mt-1"
                      />
                      {errors.dates?.endDate && (
                        <p className="text-sm text-red-400 mt-1">{errors.dates.endDate.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Client Tab */}
          <TabsContent value="client" className="space-y-6">
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  Informations Client
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client.name">Nom du Client *</Label>
                    <Input
                      id="client.name"
                      {...register("client.name", { required: "Le nom du client est requis" })}
                      className="mt-1"
                      placeholder="Nom de l'entreprise ou du particulier"
                    />
                    {errors.client?.name && (
                      <p className="text-sm text-red-400 mt-1">{errors.client.name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="client.contact">Personne de Contact *</Label>
                    <Input
                      id="client.contact"
                      {...register("client.contact", { required: "Le contact est requis" })}
                      className="mt-1"
                      placeholder="Nom du représentant"
                    />
                    {errors.client?.contact && (
                      <p className="text-sm text-red-400 mt-1">{errors.client.contact.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="client.email">Email *</Label>
                    <Input
                      id="client.email"
                      type="email"
                      {...register("client.email", { 
                        required: "L'email est requis",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Email invalide"
                        }
                      })}
                      className="mt-1"
                      placeholder="contact@client.com"
                    />
                    {errors.client?.email && (
                      <p className="text-sm text-red-400 mt-1">{errors.client.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="client.phone">Téléphone *</Label>
                    <Input
                      id="client.phone"
                      {...register("client.phone", { required: "Le téléphone est requis" })}
                      className="mt-1"
                      placeholder="+212 6XX XXX XXX"
                    />
                    {errors.client?.phone && (
                      <p className="text-sm text-red-400 mt-1">{errors.client.phone.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget" className="space-y-6">
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  Répartition Budgétaire
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="budget.estimated">Budget Total Estimé (MAD) *</Label>
                  <Input
                    id="budget.estimated"
                    type="number"
                    {...register("budget.estimated", { 
                      required: "Le budget estimé est requis",
                      valueAsNumber: true,
                      min: { value: 0, message: "Le budget doit être positif" }
                    })}
                    className="mt-1"
                    placeholder="1500000"
                  />
                  {errors.budget?.estimated && (
                    <p className="text-sm text-red-400 mt-1">{errors.budget.estimated.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="budget.labor">Main d'œuvre (MAD)</Label>
                    <Input
                      id="budget.labor"
                      type="number"
                      {...register("budget.labor", { valueAsNumber: true })}
                      className="mt-1"
                      placeholder="675000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="budget.materials">Matériaux (MAD)</Label>
                    <Input
                      id="budget.materials"
                      type="number"
                      {...register("budget.materials", { valueAsNumber: true })}
                      className="mt-1"
                      placeholder="525000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="budget.equipment">Équipements (MAD)</Label>
                    <Input
                      id="budget.equipment"
                      type="number"
                      {...register("budget.equipment", { valueAsNumber: true })}
                      className="mt-1"
                      placeholder="225000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="budget.contingency">Imprévus (MAD)</Label>
                    <Input
                      id="budget.contingency"
                      type="number"
                      {...register("budget.contingency", { valueAsNumber: true })}
                      className="mt-1"
                      placeholder="75000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Structure Tab */}
          <TabsContent value="structure" className="space-y-6">
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-orange-400" />
                    Structure du Bâtiment
                  </CardTitle>
                  <Button type="button" onClick={addStructureLevel} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter Niveau
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {structureLevels.map((level, index) => (
                  <div key={index} className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Niveau {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeStructureLevel(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div>
                        <Label>Nom du Niveau</Label>
                        <Input
                          value={level.name}
                          onChange={(e) => updateStructureLevel(index, 'name', e.target.value)}
                          placeholder="Ex: Rez-de-chaussée"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label>Type</Label>
                        <Select onValueChange={(value) => updateStructureLevel(index, 'type', value)}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Type de niveau" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="foundation">Fondation</SelectItem>
                            <SelectItem value="floor">Étage</SelectItem>
                            <SelectItem value="roof">Toiture</SelectItem>
                            <SelectItem value="infrastructure">Infrastructure</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Surface (m²)</Label>
                        <Input
                          type="number"
                          value={level.surface}
                          onChange={(e) => updateStructureLevel(index, 'surface', parseFloat(e.target.value) || 0)}
                          placeholder="120"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label>Hauteur (m)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={level.height}
                          onChange={(e) => updateStructureLevel(index, 'height', parseFloat(e.target.value) || 0)}
                          placeholder="3.0"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label>Épaisseur Dalle (cm)</Label>
                        <Input
                          type="number"
                          value={level.slabThickness}
                          onChange={(e) => updateStructureLevel(index, 'slabThickness', parseFloat(e.target.value) || 0)}
                          placeholder="20"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label>Spécifications</Label>
                        <Textarea
                          value={level.specifications}
                          onChange={(e) => updateStructureLevel(index, 'specifications', e.target.value)}
                          placeholder="Spécifications techniques..."
                          className="mt-1"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {structureLevels.length === 0 && (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">Aucun niveau défini</p>
                    <p className="text-sm text-slate-500">Cliquez sur "Ajouter Niveau" pour commencer</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Phases Tab */}
          <TabsContent value="phases" className="space-y-6">
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    Phases du Projet
                  </CardTitle>
                  <Button type="button" onClick={addPhase} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter Phase
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {phases.map((phase, index) => (
                  <div key={index} className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Phase {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePhase(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <Label>Nom de la Phase</Label>
                        <Input
                          value={phase.name}
                          onChange={(e) => updatePhase(index, 'name', e.target.value)}
                          placeholder="Ex: Gros œuvre"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label>Durée (jours)</Label>
                        <Input
                          type="number"
                          value={phase.duration}
                          onChange={(e) => updatePhase(index, 'duration', parseInt(e.target.value) || 0)}
                          placeholder="30"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label>Date de Début</Label>
                        <Input
                          type="date"
                          value={phase.startDate}
                          onChange={(e) => updatePhase(index, 'startDate', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label>Date de Fin</Label>
                        <Input
                          type="date"
                          value={phase.endDate}
                          onChange={(e) => updatePhase(index, 'endDate', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="lg:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                          value={phase.description}
                          onChange={(e) => updatePhase(index, 'description', e.target.value)}
                          placeholder="Description détaillée de la phase..."
                          className="mt-1"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {phases.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">Aucune phase définie</p>
                    <p className="text-sm text-slate-500">Cliquez sur "Ajouter Phase" pour planifier le projet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
