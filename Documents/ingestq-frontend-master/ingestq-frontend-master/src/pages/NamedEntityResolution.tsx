
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { 
//   Users, 
//   Building, 
//   MapPin, 
//   Calendar, 
//   ArrowRight, 
//   RefreshCw, 
//   CheckCircle,
//   ArrowLeft,
//   SkipForward
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useToast } from "@/hooks/use-toast";

// interface EntityMatch {
//   id: string;
//   originalName: string;
//   suggestedMatch: string;
//   confidence: number;
//   type: 'person' | 'organization' | 'location' | 'date';
//   status: 'pending' | 'accepted' | 'rejected';
// }

// const mockMatches: EntityMatch[] = [
//   {
//     id: '1',
//     originalName: 'John Smith',
//     suggestedMatch: 'Jonathan Smith',
//     confidence: 95,
//     type: 'person',
//     status: 'pending'
//   },
//   {
//     id: '2',
//     originalName: 'Microsoft Corp',
//     suggestedMatch: 'Microsoft Corporation',
//     confidence: 98,
//     type: 'organization',
//     status: 'pending'
//   },
//   {
//     id: '3',
//     originalName: 'NYC',
//     suggestedMatch: 'New York City',
//     confidence: 92,
//     type: 'location',
//     status: 'pending'
//   },
//   {
//     id: '4',
//     originalName: '01/15/2024',
//     suggestedMatch: 'January 15, 2024',
//     confidence: 100,
//     type: 'date',
//     status: 'pending'
//   }
// ];

// export default function NamedEntityResolution() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [matches, setMatches] = useState<EntityMatch[]>(mockMatches);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [processingProgress, setProcessingProgress] = useState(0);

//   const handleAccept = (matchId: string) => {
//     setMatches(prev => prev.map(match => 
//       match.id === matchId 
//         ? { ...match, status: 'accepted' as const }
//         : match
//     ));
    
//     toast({
//       title: "Match Accepted",
//       description: "Entity match has been accepted and will be applied",
//     });
//   };

//   const handleReject = (matchId: string) => {
//     setMatches(prev => prev.map(match => 
//       match.id === matchId 
//         ? { ...match, status: 'rejected' as const }
//         : match
//     ));
    
//     toast({
//       title: "Match Rejected",
//       description: "Entity match has been rejected and will not be applied",
//     });
//   };

//   const handleAcceptAll = () => {
//     setMatches(prev => prev.map(match => ({ ...match, status: 'accepted' as const })));
    
//     toast({
//       title: "All Matches Accepted",
//       description: "All entity matches have been accepted",
//     });
//   };

//   const handleProcessEntities = async () => {
//     setIsProcessing(true);
//     setProcessingProgress(0);
    
//     // Simulate processing
//     for (let i = 0; i <= 100; i += 10) {
//       await new Promise(resolve => setTimeout(resolve, 200));
//       setProcessingProgress(i);
//     }
    
//     setIsProcessing(false);
    
//     toast({
//       title: "Entity Resolution Complete",
//       description: "All entities have been processed and resolved",
//     });
    
//     // Auto-proceed after processing
//     setTimeout(() => {
//       navigate('/dashboard/business-logic');
//     }, 1000);
//   };

//   const handleGoBack = () => {
//     navigate('/dashboard/rules');
//   };

//   const handleSkip = () => {
//     navigate('/dashboard/business-logic');
//     toast({
//       title: "NER Skipped",
//       description: "Named Entity Resolution has been skipped",
//     });
//   };

//   const getEntityIcon = (type: string) => {
//     switch (type) {
//       case 'person': return <Users className="w-4 h-4" />;
//       case 'organization': return <Building className="w-4 h-4" />;
//       case 'location': return <MapPin className="w-4 h-4" />;
//       case 'date': return <Calendar className="w-4 h-4" />;
//       default: return <Users className="w-4 h-4" />;
//     }
//   };

//   const getEntityColor = (type: string) => {
//     switch (type) {
//       case 'person': return 'bg-blue-100 text-blue-800';
//       case 'organization': return 'bg-green-100 text-green-800';
//       case 'location': return 'bg-purple-100 text-purple-800';
//       case 'date': return 'bg-orange-100 text-orange-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const pendingCount = matches.filter(m => m.status === 'pending').length;
//   const acceptedCount = matches.filter(m => m.status === 'accepted').length;
//   const rejectedCount = matches.filter(m => m.status === 'rejected').length;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
//       <div className="container mt-14 mx-auto p-6">
//         {/* Header with Navigation */}
//         <div className="flex items-center justify-between mb-6">
//           {/* <Button
//             variant="outline"
//             onClick={handleGoBack}
//             className="flex items-center gap-2"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Go Back
//           </Button> */}

//           <div className="text-start">
//             <h1 className="text-3xl font-bold text-foreground">Named Entity Resolution</h1>
//             <p className="text-muted-foreground">Review and resolve entity matches in your data</p>
//           </div>

//           {/* <Button
//             variant="outline"
//             onClick={handleSkip}
//             className="flex items-center gap-2"
//           >
//             <SkipForward className="w-4 h-4" />
//             Skip
//           </Button> */}
//         </div>

//         {/* Statistics */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Total Matches</p>
//                   <p className="text-2xl font-bold">{matches.length}</p>
//                 </div>
//                 <RefreshCw className="w-8 h-8 text-muted-foreground" />
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Pending</p>
//                   <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
//                 </div>
//                 <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
//                   <RefreshCw className="w-4 h-4 text-yellow-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Accepted</p>
//                   <p className="text-2xl font-bold text-green-600">{acceptedCount}</p>
//                 </div>
//                 <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
//                   <CheckCircle className="w-4 h-4 text-green-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
          
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Rejected</p>
//                   <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
//                 </div>
//                 <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
//                   <RefreshCw className="w-4 h-4 text-red-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Entity Matches */}
//         <Card className="mb-6">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div>
//                 <CardTitle>Entity Matches</CardTitle>
//                 <CardDescription>Review suggested entity matches and accept or reject them</CardDescription>
//               </div>
//               <Button onClick={handleAcceptAll} variant="outline">
//                 Accept All
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {matches.map((match) => (
//                 <div key={match.id} className="border rounded-lg p-4">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-4">
//                       <div className="flex items-center space-x-2">
//                         {getEntityIcon(match.type)}
//                         <Badge className={getEntityColor(match.type)}>
//                           {match.type}
//                         </Badge>
//                       </div>
//                       <div>
//                         <div className="flex items-center space-x-2">
//                           <span className="font-medium">{match.originalName}</span>
//                           <ArrowRight className="w-4 h-4 text-muted-foreground" />
//                           <span className="font-medium text-primary">{match.suggestedMatch}</span>
//                         </div>
//                         <p className="text-sm text-muted-foreground">
//                           Confidence: {match.confidence}%
//                         </p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center space-x-2">
//                       {match.status === 'pending' && (
//                         <>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => handleReject(match.id)}
//                           >
//                             Reject
//                           </Button>
//                           <Button
//                             size="sm"
//                             onClick={() => handleAccept(match.id)}
//                           >
//                             Accept
//                           </Button>
//                         </>
//                       )}
                      
//                       {match.status === 'accepted' && (
//                         <Badge className="bg-green-100 text-green-800">
//                           <CheckCircle className="w-3 h-3 mr-1" />
//                           Accepted
//                         </Badge>
//                       )}
                      
//                       {match.status === 'rejected' && (
//                         <Badge variant="destructive">
//                           Rejected
//                         </Badge>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Processing */}
//         {isProcessing && (
//           <Card className="mb-6">
//             <CardContent className="p-6">
//               <div className="text-center space-y-4">
//                 <RefreshCw className="w-12 h-12 mx-auto animate-spin text-primary" />
//                 <div>
//                   <h3 className="text-lg font-medium">Processing Entities</h3>
//                   <p className="text-muted-foreground">Applying entity resolutions to your data...</p>
//                 </div>
//                 <Progress value={processingProgress} className="w-full max-w-md mx-auto" />
//                 <p className="text-sm text-muted-foreground">{processingProgress}% Complete</p>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Actions */}
//         <div className="flex justify-between">
//           <Button
//             variant="outline"
//             onClick={handleGoBack}
//             className="flex items-center gap-2"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Go Back
//           </Button>

//           <div className="flex items-center gap-4">
//             <Button
//               variant="outline"
//               onClick={handleSkip}
//               className="flex items-center gap-2"
//             >
//               <SkipForward className="w-4 h-4" />
//               Skip
//             </Button>
            
//             <Button
//               onClick={handleProcessEntities}
//               disabled={isProcessing}
//               className="flex items-center gap-2"
//             >
//               {isProcessing ? (
//                 <RefreshCw className="w-4 h-4 animate-spin" />
//               ) : (
//                 <ArrowRight className="w-4 h-4" />
//               )}
//               {isProcessing ? 'Processing...' : 'Process Entities'}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


//----------------------------------------------------------------------------------------------


// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import {
//   Users,
//   Building,
//   MapPin,
//   Calendar,
//   ArrowRight,
//   RefreshCw,
//   CheckCircle,
//   ArrowLeft,
//   SkipForward
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useToast } from "@/hooks/use-toast";
// import { resolveEntities, ResolveEntitiesRequest, ResolveEntitiesResponse, ResolvedEntity, chooseApply, ChooseApplyRequest, ChooseApplyResponse } from "@/lib/api";

// interface EntityMatch {
//   id: string;
//   originalName: string;
//   suggestedMatch: string;
//   confidence: number;
//   type: string;
//   status: 'pending' | 'accepted' | 'rejected';
// }

// export default function NamedEntityResolution() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [matches, setMatches] = useState<EntityMatch[]>([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [processingProgress, setProcessingProgress] = useState(0);

//   const validateLocalStorage = () => {
//     const bucket = localStorage.getItem('selectedBucket');
//     const key = localStorage.getItem('selectedFile');
//     console.log('LocalStorage - selectedBucket:', bucket);
//     console.log('LocalStorage - selectedFile:', key);
//     if (!bucket || !key) {
//       console.warn('Missing or empty bucket or key in localStorage. Redirecting to upload page.');
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Missing bucket name or key. Please upload the file again.",
//       });
//       navigate('/dashboard/upload');
//       return false;
//     }
//     return { bucket, key };
//   };

//   useEffect(() => {
//     const fetchMatches = async () => {
//       const storage = validateLocalStorage();
//       if (!storage) return;
//       const { bucket, key } = storage;

//       try {
//         const ext = key.match(/\.[^.]*$/)?.[0] || '';
//         const base = key.slice(0, -ext.length);
//         const temp_output_key = `${base}_temp${ext}`;

//         const response: ResolveEntitiesResponse = await resolveEntities({ bucket, key, temp_output_key });
//         console.log('Resolve Entities Response:', response); // Debugging log

//         if (response.status === 'success') {
//           const mappedMatches: EntityMatch[] = response.resolutions?.map((r, i) => ({
//             id: `api-${i}`,
//             originalName: r.Name,
//             suggestedMatch: r["Resolved name"],
//             confidence: parseFloat(r.Confidence),
//             type: r.type,
//             status: 'pending' as const
//           })) || []; // Default to empty array if response.results is undefined

//           setMatches(mappedMatches);

//           if (mappedMatches.length === 0) {
//             toast({
//               title: "No Entities Found",
//               description: "No entities were found to resolve in the selected file.",
//             });
//           }
//         } else {
//           console.warn('API response unsuccessful:', response.message);
//           toast({
//             title: "Error",
//             description: response.message || "Failed to fetch entity matches.",
//             variant: "destructive",
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching entity matches:", error);
//         toast({
//           title: "Error",
//           description: `Failed to fetch entity matches: ${error instanceof Error ? error.message : 'Unknown error'}`,
//           variant: "destructive",
//         });
//       }
//     };

//     fetchMatches();
//   }, [toast, navigate]);

//   const handleAccept = (matchId: string) => {
//     setMatches(prev => prev.map(match =>
//       match.id === matchId
//         ? { ...match, status: 'accepted' as const }
//         : match
//     ));
//     toast({
//       title: "Match Accepted",
//       description: "Entity match has been accepted and will be applied",
//     });
//   };

//   const handleReject = (matchId: string) => {
//     setMatches(prev => prev.map(match =>
//       match.id === matchId
//         ? { ...match, status: 'rejected' as const }
//         : match
//     ));
//     toast({
//       title: "Match Rejected",
//       description: "Entity match has been rejected and will not be applied",
//     });
//   };

//   const handleAcceptAll = () => {
//     setMatches(prev => prev.map(match => ({ ...match, status: 'accepted' as const })));
//     toast({
//       title: "All Matches Accepted",
//       description: "All entity matches have been accepted",
//     });
//   };

//   const handleProcessEntities = async () => {
//     const storage = validateLocalStorage();
//     if (!storage) return;
//     const { bucket, key } = storage;

//     setIsProcessing(true);
//     setProcessingProgress(0);

//     try {
//       const acceptedMatches = matches.filter(m => m.status === 'accepted');
//       const chosen: ResolvedEntity[] = acceptedMatches.map(m => ({
//         type: m.type,
//         Name: m.originalName,
//         "Resolved name": m.suggestedMatch,
//         Confidence: m.confidence.toString(),
//       }));

//       if (chosen.length > 0) {
//         const response: ChooseApplyResponse = await chooseApply({ bucket, key, chosen });
//         if (response.status !== 'success') {
//           throw new Error(response.message || 'Failed to apply entity resolutions');
//         }
//       }

//       for (let i = 0; i <= 100; i += 10) {
//         await new Promise(resolve => setTimeout(resolve, 200));
//         setProcessingProgress(i);
//       }

//       toast({
//         title: "Entity Resolution Complete",
//         description: "All entities have been processed and resolved",
//       });

//       setTimeout(() => {
//         navigate('/dashboard/business-logic');
//       }, 1000);
//     } catch (error) {
//       console.error("Error applying entity resolutions:", error);
//       toast({
//         title: "Error",
//         description: `Failed to apply entity resolutions: ${error instanceof Error ? error.message : 'Unknown error'}`,
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleGoBack = () => {
//     navigate('/dashboard/rules');
//   };

//   const handleSkip = () => {
//     navigate('/dashboard/business-logic');
//     toast({
//       title: "NER Skipped",
//       description: "Named Entity Resolution has been skipped",
//     });
//   };

//   const getEntityIcon = (type: string) => {
//     const iconMap: Record<string, JSX.Element> = {
//       person: <Users className="w-4 h-4" />,
//       organization: <Building className="w-4 h-4" />,
//       location: <MapPin className="w-4 h-4" />,
//       date: <Calendar className="w-4 h-4" />,
//     };
//     return iconMap[type.toLowerCase()] || <Users className="w-4 h-4" />;
//   };

//   const getEntityColor = (type: string) => {
//     const colorMap: Record<string, string> = {
//       person: 'bg-blue-100 text-blue-800',
//       organization: 'bg-green-100 text-green-800',
//       location: 'bg-purple-100 text-purple-800',
//       date: 'bg-orange-100 text-orange-800',
//     };
//     return colorMap[type.toLowerCase()] || 'bg-gray-100 text-gray-800';
//   };

//   const pendingCount = matches.filter(m => m.status === 'pending').length;
//   const acceptedCount = matches.filter(m => m.status === 'accepted').length;
//   const rejectedCount = matches.filter(m => m.status === 'rejected').length;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
//       <div className="container mt-14 mx-auto p-6">
//         <div className="flex items-center justify-between mb-6">
//           <div className="text-start">
//             <h1 className="text-3xl font-bold text-foreground">Named Entity Resolution</h1>
//             <p className="text-muted-foreground">Review and resolve entity matches in your data</p>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Total Matches</p>
//                   <p className="text-2xl font-bold">{matches.length}</p>
//                 </div>
//                 <RefreshCw className="w-8 h-8 text-muted-foreground" />
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Pending</p>
//                   <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
//                 </div>
//                 <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
//                   <RefreshCw className="w-4 h-4 text-yellow-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Accepted</p>
//                   <p className="text-2xl font-bold text-green-600">{acceptedCount}</p>
//                 </div>
//                 <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
//                   <CheckCircle className="w-4 h-4 text-green-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Rejected</p>
//                   <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
//                 </div>
//                 <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
//                   <RefreshCw className="w-4 h-4 text-red-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//         <Card className="mb-6">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div>
//                 <CardTitle>Entity Matches</CardTitle>
//                 <CardDescription>Review suggested entity matches and accept or reject them</CardDescription>
//               </div>
//               <Button onClick={handleAcceptAll} variant="outline" disabled={matches.length === 0}>
//                 Accept All
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {matches.length === 0 ? (
//                 <p className="text-center text-muted-foreground">No entities found to resolve.</p>
//               ) : (
//                 matches.map((match) => (
//                   <div key={match.id} className="border rounded-lg p-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-4">
//                         <div className="flex items-center space-x-2">
//                           {getEntityIcon(match.type)}
//                           <Badge className={getEntityColor(match.type)}>
//                             {match.type}
//                           </Badge>
//                         </div>
//                         <div>
//                           <div className="flex items-center space-x-2">
//                             <span className="font-medium">{match.originalName}</span>
//                             <ArrowRight className="w-4 h-4 text-muted-foreground" />
//                             <span className="font-medium text-primary">{match.suggestedMatch}</span>
//                           </div>
//                           <p className="text-sm text-muted-foreground">
//                             Confidence: {match.confidence}%
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         {match.status === 'pending' && (
//                           <>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => handleReject(match.id)}
//                             >
//                               Reject
//                             </Button>
//                             <Button
//                               size="sm"
//                               onClick={() => handleAccept(match.id)}
//                             >
//                               Accept
//                             </Button>
//                           </>
//                         )}
//                         {match.status === 'accepted' && (
//                           <Badge className="bg-green-100 text-green-800">
//                             <CheckCircle className="w-3 h-3 mr-1" />
//                             Accepted
//                           </Badge>
//                         )}
//                         {match.status === 'rejected' && (
//                           <Badge variant="destructive">
//                             Rejected
//                           </Badge>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </CardContent>
//         </Card>
//         {isProcessing && (
//           <Card className="mb-6">
//             <CardContent className="p-6">
//               <div className="text-center space-y-4">
//                 <RefreshCw className="w-12 h-12 mx-auto animate-spin text-primary" />
//                 <div>
//                   <h3 className="text-lg font-medium">Processing Entities</h3>
//                   <p className="text-muted-foreground">Applying entity resolutions to your data...</p>
//                 </div>
//                 <Progress value={processingProgress} className="w-full max-w-md mx-auto" />
//                 <p className="text-sm text-muted-foreground">{processingProgress}% Complete</p>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//         <div className="flex justify-between">
//           <Button
//             variant="outline"
//             onClick={handleGoBack}
//             className="flex items-center gap-2"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Go Back
//           </Button>
//           <div className="flex items-center gap-4">
//             <Button
//               variant="outline"
//               onClick={handleSkip}
//               className="flex items-center gap-2"
//             >
//               <SkipForward className="w-4 h-4" />
//               Skip
//             </Button>
//             <Button
//               onClick={handleProcessEntities}
//               disabled={isProcessing || matches.length === 0}
//               className="flex items-center gap-2"
//             >
//               {isProcessing ? (
//                 <RefreshCw className="w-4 h-4 animate-spin" />
//               ) : (
//                 <ArrowRight className="w-4 h-4" />
//               )}
//               {isProcessing ? 'Processing...' : 'Process Entities'}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

//------------------------------------------------------------------------------------------------

// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import {
//   Users,
//   Building,
//   MapPin,
//   Calendar,
//   ArrowRight,
//   RefreshCw,
//   CheckCircle,
//   ArrowLeft,
//   SkipForward
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useToast } from "@/hooks/use-toast";
// import { resolveEntities, ResolveEntitiesRequest, ResolveEntitiesResponse, ResolvedEntity, chooseApply, ChooseApplyRequest, ChooseApplyResponse } from "@/lib/api";

// interface EntityMatch {
//   id: string;
//   originalName: string;
//   suggestedMatch: string;
//   confidence: number;
//   type: string;
//   status: 'pending' | 'accepted' | 'rejected';
// }

// export default function NamedEntityResolution() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [matches, setMatches] = useState<EntityMatch[]>([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [processingProgress, setProcessingProgress] = useState(0);
//   const hasFetched = useRef(false); // Prevent multiple API calls

//   const validateLocalStorage = () => {
//     const bucket = localStorage.getItem('selectedBucket');
//     const key = localStorage.getItem('selectedFile');
//     console.log('LocalStorage - selectedBucket:', bucket);
//     console.log('LocalStorage - selectedFile:', key);
//     if (!bucket || !key) {
//       console.warn('Missing or empty bucket or key in localStorage. Redirecting to upload page.');
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Missing bucket name or key. Please upload the file again.",
//       });
//       navigate('/dashboard/upload');
//       return false;
//     }
//     return { bucket, key };
//   };

//   useEffect(() => {
//     const fetchMatches = async () => {
//       if (hasFetched.current) return; // Prevent multiple executions
//       hasFetched.current = true;

//       const storage = validateLocalStorage();
//       if (!storage) return;
//       const { bucket, key } = storage;

//       try {
//         const ext = key.match(/\.[^.]*$/)?.[0] || '';
//         const base = key.slice(0, -ext.length);
//         const temp_output_key = `${base}_temp${ext}`;

//         const response: ResolveEntitiesResponse = await resolveEntities({ bucket, key, temp_output_key });
//         console.log('Resolve Entities Response:', response);

//         if (response.status === 'success') {
//           const mappedMatches: EntityMatch[] = response.resolutions?.map((r, i) => ({
//             id: `api-${i}`,
//             originalName: r.Name,
//             suggestedMatch: r["Resolved name"],
//             confidence: parseFloat(r.Confidence),
//             type: r.type,
//             status: 'pending' as const
//           })) || [];

//           setMatches(mappedMatches);

//           if (mappedMatches.length === 0) {
//             toast({
//               title: "No Entities Found",
//               description: "No entities were found to resolve in the selected file.",
//             });
//           }
//         } else {
//           console.warn('API response unsuccessful:', response.message);
//           toast({
//             title: "Error",
//             description: response.message || "Failed to fetch entity matches.",
//             variant: "destructive",
//           });
//         }
//       } catch (error) {
//         console.error("Error fetching entity matches:", error);
//         toast({
//           title: "Error",
//           description: `Failed to fetch entity matches: ${error instanceof Error ? error.message : 'Unknown error'}`,
//           variant: "destructive",
//         });
//       }
//     };

//     fetchMatches();
//   }, [toast, navigate]);

//   const handleAccept = (matchId: string) => {
//     setMatches(prev => prev.map(match =>
//       match.id === matchId
//         ? { ...match, status: 'accepted' as const }
//         : match
//     ));
//     toast({
//       title: "Match Accepted",
//       description: "Entity match has been accepted and will be applied",
//     });
//   };

//   const handleReject = (matchId: string) => {
//     setMatches(prev => prev.map(match =>
//       match.id === matchId
//         ? { ...match, status: 'rejected' as const }
//         : match
//     ));
//     toast({
//       title: "Match Rejected",
//       description: "Entity match has been rejected and will not be applied",
//     });
//   };

//   const handleAcceptAll = () => {
//     setMatches(prev => prev.map(match => ({ ...match, status: 'accepted' as const })));
//     toast({
//       title: "All Matches Accepted",
//       description: "All entity matches have been accepted",
//     });
//   };

//   const handleProcessEntities = async () => {
//     const storage = validateLocalStorage();
//     if (!storage) return;
//     const { bucket, key } = storage;

//     setIsProcessing(true);
//     setProcessingProgress(0);

//     try {
//       const acceptedMatches = matches.filter(m => m.status === 'accepted');
//       const chosen: ResolvedEntity[] = acceptedMatches.map(m => ({
//         type: m.type,
//         Name: m.originalName,
//         "Resolved name": m.suggestedMatch,
//         Confidence: `${m.confidence}%` // Format confidence as string with % for API
//       }));

//       if (chosen.length > 0) {
//         const response: ChooseApplyResponse = await chooseApply({ bucket, key, chosen });
//         if (response.status !== 'success') {
//           throw new Error(response.message || 'Failed to apply entity resolutions');
//         }
//         toast({
//           title: "File Updated",
//           description: `Entity resolutions have been applied and overwritten to ${key} in bucket ${bucket}.`,
//         });
//       } else {
//         toast({
//           title: "No Entities Selected",
//           description: "No entities were accepted to process.",
//           variant: "destructive",
//         });
//         setIsProcessing(false);
//         return;
//       }

//       for (let i = 0; i <= 100; i += 10) {
//         await new Promise(resolve => setTimeout(resolve, 200));
//         setProcessingProgress(i);
//       }

//       toast({
//         title: "Entity Resolution Complete",
//         description: "All entities have been processed and the file has been updated.",
//       });

//       setTimeout(() => {
//         navigate('/dashboard/business-logic');
//       }, 1000);
//     } catch (error) {
//       console.error("Error applying entity resolutions:", error);
//       toast({
//         title: "Error",
//         description: `Failed to apply entity resolutions: ${error instanceof Error ? error.message : 'Unknown error'}`,
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleGoBack = () => {
//     navigate('/dashboard/rules');
//   };

//   const handleSkip = () => {
//     navigate('/dashboard/business-logic');
//     toast({
//       title: "NER Skipped",
//       description: "Named Entity Resolution has been skipped",
//     });
//   };

//   const getEntityIcon = (type: string) => {
//     const iconMap: Record<string, JSX.Element> = {
//       person: <Users className="w-4 h-4" />,
//       organization: <Building className="w-4 h-4" />,
//       location: <MapPin className="w-4 h-4" />,
//       date: <Calendar className="w-4 h-4" />,
//       place: <MapPin className="w-4 h-4" />, // Added for 'place' type
//     };
//     return iconMap[type.toLowerCase()] || <Users className="w-4 h-4" />;
//   };

//   const getEntityColor = (type: string) => {
//     const colorMap: Record<string, string> = {
//       person: 'bg-blue-100 text-blue-800',
//       organization: 'bg-green-100 text-green-800',
//       location: 'bg-purple-100 text-purple-800',
//       date: 'bg-orange-100 text-orange-800',
//       place: 'bg-purple-100 text-purple-800', // Added for 'place' type
//     };
//     return colorMap[type.toLowerCase()] || 'bg-gray-100 text-gray-800';
//   };

//   const pendingCount = matches.filter(m => m.status === 'pending').length;
//   const acceptedCount = matches.filter(m => m.status === 'accepted').length;
//   const rejectedCount = matches.filter(m => m.status === 'rejected').length;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
//       <div className="container mt-14 mx-auto p-6">
//         <div className="flex items-center justify-between mb-6">
//           <div className="text-start">
//             <h1 className="text-3xl font-bold text-foreground">Named Entity Resolution</h1>
//             <p className="text-muted-foreground">Review and resolve entity matches in your data</p>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Total Matches</p>
//                   <p className="text-2xl font-bold">{matches.length}</p>
//                 </div>
//                 <RefreshCw className="w-8 h-8 text-muted-foreground" />
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Pending</p>
//                   <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
//                 </div>
//                 <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
//                   <RefreshCw className="w-4 h-4 text-yellow-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Accepted</p>
//                   <p className="text-2xl font-bold text-green-600">{acceptedCount}</p>
//                 </div>
//                 <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
//                   <CheckCircle className="w-4 h-4 text-green-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Rejected</p>
//                   <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
//                 </div>
//                 <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
//                   <RefreshCw className="w-4 h-4 text-red-600" />
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//         <Card className="mb-6">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div>
//                 <CardTitle>Entity Matches</CardTitle>
//                 <CardDescription>Review suggested entity matches and accept or reject them</CardDescription>
//               </div>
//               <Button onClick={handleAcceptAll} variant="outline" disabled={matches.length === 0}>
//                 Accept All
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {matches.length === 0 ? (
//                 <p className="text-center text-muted-foreground">No entities found to resolve.</p>
//               ) : (
//                 matches.map((match) => (
//                   <div key={match.id} className="border rounded-lg p-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-4">
//                         <div className="flex items-center space-x-2">
//                           {getEntityIcon(match.type)}
//                           <Badge className={getEntityColor(match.type)}>
//                             {match.type}
//                           </Badge>
//                         </div>
//                         <div>
//                           <div className="flex items-center space-x-2">
//                             <span className="font-medium">{match.originalName}</span>
//                             <ArrowRight className="w-4 h-4 text-muted-foreground" />
//                             <span className="font-medium text-primary">{match.suggestedMatch}</span>
//                           </div>
//                           <p className="text-sm text-muted-foreground">
//                             Confidence: {match.confidence}%
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         {match.status === 'pending' && (
//                           <>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => handleReject(match.id)}
//                             >
//                               Reject
//                             </Button>
//                             <Button
//                               size="sm"
//                               onClick={() => handleAccept(match.id)}
//                             >
//                               Accept
//                             </Button>
//                           </>
//                         )}
//                         {match.status === 'accepted' && (
//                           <Badge className="bg-green-100 text-green-800">
//                             <CheckCircle className="w-3 h-3 mr-1" />
//                             Accepted
//                           </Badge>
//                         )}
//                         {match.status === 'rejected' && (
//                           <Badge variant="destructive">
//                             Rejected
//                           </Badge>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </CardContent>
//         </Card>
//         {isProcessing && (
//           <Card className="mb-6">
//             <CardContent className="p-6">
//               <div className="text-center space-y-4">
//                 <RefreshCw className="w-12 h-12 mx-auto animate-spin text-primary" />
//                 <div>
//                   <h3 className="text-lg font-medium">Processing Entities</h3>
//                   <p className="text-muted-foreground">Applying entity resolutions to your data...</p>
//                 </div>
//                 <Progress value={processingProgress} className="w-full max-w-md mx-auto" />
//                 <p className="text-sm text-muted-foreground">{processingProgress}% Complete</p>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//         <div className="flex justify-between">
//           <Button
//             variant="outline"
//             onClick={handleGoBack}
//             className="flex items-center gap-2"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Go Back
//           </Button>
//           <div className="flex items-center gap-4">
//             <Button
//               variant="outline"
//               onClick={handleSkip}
//               className="flex items-center gap-2"
//             >
//               <SkipForward className="w-4 h-4" />
//               Skip
//             </Button>
//             <Button
//               onClick={handleProcessEntities}
//               disabled={isProcessing || matches.length === 0}
//               className="flex items-center gap-2"
//             >
//               {isProcessing ? (
//                 <RefreshCw className="w-4 h-4 animate-spin" />
//               ) : (
//                 <ArrowRight className="w-4 h-4" />
//               )}
//               {isProcessing ? 'Processing...' : 'Process Entities'}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


//-----------------------------------------------------------------------------------------------

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Building,
  MapPin,
  Calendar,
  ArrowRight,
  RefreshCw,
  CheckCircle,
  ArrowLeft,
  SkipForward
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { resolveEntities, ResolveEntitiesRequest, ResolveEntitiesResponse, ResolvedEntity, chooseApply, ChooseApplyRequest, ChooseApplyResponse } from "@/lib/api";

interface EntityMatch {
  id: string;
  originalName: string;
  suggestedMatch: string;
  confidence: number;
  type: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export default function NamedEntityResolution() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [matches, setMatches] = useState<EntityMatch[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const hasFetched = useRef(false); // Prevent multiple API calls unless triggered

  const validateLocalStorage = () => {
    const bucket = localStorage.getItem('selectedBucket');
    const key = localStorage.getItem('selectedFile');
    console.log('LocalStorage - selectedBucket:', bucket);
    console.log('LocalStorage - selectedFile:', key);
    if (!bucket || !key) {
      console.warn('Missing or empty bucket or key in localStorage. Redirecting to upload page.');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Missing bucket name or key. Please upload the file again.",
      });
      navigate('/dashboard/upload');
      return false;
    }
    return { bucket, key };
  };

  const fetchMatches = async () => {
    hasFetched.current = true; // Allow re-running when triggered by button
    const storage = validateLocalStorage();
    if (!storage) return;
    const { bucket, key } = storage;

    try {
      const ext = key.match(/\.[^.]*$/)?.[0] || '';
      const base = key.slice(0, -ext.length);
      const temp_output_key = `${base}_temp${ext}`;

      const response: ResolveEntitiesResponse = await resolveEntities({ bucket, key, temp_output_key });
      console.log('Resolve Entities Response:', response);

      if (response.status === 'success') {
        const mappedMatches: EntityMatch[] = response.resolutions?.map((r, i) => ({
          id: `api-${i}`,
          originalName: r.Name,
          suggestedMatch: r["Resolved name"],
          confidence: parseFloat(r.Confidence),
          type: r.type,
          status: 'pending' as const
        })) || [];

        setMatches(mappedMatches);

        if (mappedMatches.length === 0) {
          toast({
            title: "No Entities Found",
            description: "No entities were found to resolve in the selected file.",
          });
        }
      } else {
        console.warn('API response unsuccessful:', response.message);
        toast({
          title: "Error",
          description: response.message || "Failed to fetch entity matches.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching entity matches:", error);
      toast({
        title: "Error",
        description: `Failed to fetch entity matches: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Do not fetch on mount, wait for button click
  }, [toast, navigate]);

  const handleAccept = (matchId: string) => {
    setMatches(prev => prev.map(match =>
      match.id === matchId
        ? { ...match, status: 'accepted' as const }
        : match
    ));
    toast({
      title: "Match Accepted",
      description: "Entity match has been accepted and will be applied",
    });
  };

  const handleReject = (matchId: string) => {
    setMatches(prev => prev.map(match =>
      match.id === matchId
        ? { ...match, status: 'rejected' as const }
        : match
    ));
    toast({
      title: "Match Rejected",
      description: "Entity match has been rejected and will not be applied",
    });
  };

  const handleAcceptAll = () => {
    setMatches(prev => prev.map(match => ({ ...match, status: 'accepted' as const })));
    toast({
      title: "All Matches Accepted",
      description: "All entity matches have been accepted",
    });
  };

  const handleProcessEntities = async () => {
    const storage = validateLocalStorage();
    if (!storage) return;
    const { bucket, key } = storage;

    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      const acceptedMatches = matches.filter(m => m.status === 'accepted');
      const chosen: ResolvedEntity[] = acceptedMatches.map(m => ({
        type: m.type,
        Name: m.originalName,
        "Resolved name": m.suggestedMatch,
        Confidence: `${m.confidence}%` // Format confidence as string with % for API
      }));

      if (chosen.length > 0) {
        const response: ChooseApplyResponse = await chooseApply({ bucket, key, chosen });
        if (response.status !== 'success') {
          throw new Error(response.message || 'Failed to apply entity resolutions');
        }
        toast({
          title: "File Updated",
          description: `Entity resolutions have been applied and overwritten to ${key} in bucket ${bucket}.`,
        });
      } else {
        toast({
          title: "No Entities Selected",
          description: "No entities were accepted to process.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProcessingProgress(i);
      }

      toast({
        title: "Entity Resolution Complete",
        description: "All entities have been processed and the file has been updated.",
      });

      setTimeout(() => {
        navigate('/dashboard/business-logic');
      }, 1000);
    } catch (error) {
      console.error("Error applying entity resolutions:", error);
      toast({
        title: "Error",
        description: `Failed to apply entity resolutions: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoBack = () => {
    navigate('/dashboard/rules');
  };

  const handleSkip = () => {
            localStorage.setItem('ner', 'skipped');

    navigate('/dashboard/business-logic');
    toast({
      title: "NER Skipped",
      description: "Named Entity Resolution has been skipped",
    });
  };

  const handleRunNER = () => {
            localStorage.setItem('ner', 'executed');
    hasFetched.current = false; // Allow fetchMatches to run again
    fetchMatches();
    toast({
      title: "Running NER",
      description: "Fetching new entity matches...",
    });
  };

  const getEntityIcon = (type: string) => {
    const iconMap: Record<string, JSX.Element> = {
      person: <Users className="w-4 h-4" />,
      organization: <Building className="w-4 h-4" />,
      location: <MapPin className="w-4 h-4" />,
      date: <Calendar className="w-4 h-4" />,
      place: <MapPin className="w-4 h-4" />, // Added for 'place' type
    };
    return iconMap[type.toLowerCase()] || <Users className="w-4 h-4" />;
  };

  const getEntityColor = (type: string) => {
    const colorMap: Record<string, string> = {
      person: 'bg-blue-100 text-blue-800',
      organization: 'bg-green-100 text-green-800',
      location: 'bg-purple-100 text-purple-800',
      date: 'bg-orange-100 text-orange-800',
      place: 'bg-purple-100 text-purple-800', // Added for 'place' type
    };
    return colorMap[type.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const pendingCount = matches.filter(m => m.status === 'pending').length;
  const acceptedCount = matches.filter(m => m.status === 'accepted').length;
  const rejectedCount = matches.filter(m => m.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mt-14 mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="text-start">
            <h1 className="text-3xl font-bold text-foreground">Named Entity Resolution</h1>
            <p className="text-muted-foreground">Review and resolve entity matches in your data</p>
          </div>
          <Button onClick={handleRunNER} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Run NER
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Matches</p>
                  <p className="text-2xl font-bold">{matches.length}</p>
                </div>
                <RefreshCw className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Accepted</p>
                  <p className="text-2xl font-bold text-green-600">{acceptedCount}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <RefreshCw className="w-4 h-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Entity Matches</CardTitle>
                <CardDescription>Review suggested entity matches and accept or reject them</CardDescription>
              </div>
              <Button onClick={handleAcceptAll} variant="outline" disabled={matches.length === 0}>
                Accept All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {matches.length === 0 ? (
                <p className="text-center text-muted-foreground">Click 'Run NER' to fetch entities.</p>
              ) : (
                matches.map((match) => (
                  <div key={match.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getEntityIcon(match.type)}
                          <Badge className={getEntityColor(match.type)}>
                            {match.type}
                          </Badge>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{match.originalName}</span>
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-primary">{match.suggestedMatch}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Confidence: {match.confidence}%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {match.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReject(match.id)}
                            >
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAccept(match.id)}
                            >
                              Accept
                            </Button>
                          </>
                        )}
                        {match.status === 'accepted' && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Accepted
                          </Badge>
                        )}
                        {match.status === 'rejected' && (
                          <Badge variant="destructive">
                            Rejected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        {isProcessing && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <RefreshCw className="w-12 h-12 mx-auto animate-spin text-primary" />
                <div>
                  <h3 className="text-lg font-medium">Processing Entities</h3>
                  <p className="text-muted-foreground">Applying entity resolutions to your data...</p>
                </div>
                <Progress value={processingProgress} className="w-full max-w-md mx-auto" />
                <p className="text-sm text-muted-foreground">{processingProgress}% Complete</p>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex items-center gap-2"
            >
              <SkipForward className="w-4 h-4" />
              Skip
            </Button>
            <Button
              onClick={handleProcessEntities}
              disabled={isProcessing || matches.length === 0}
              className="flex items-center gap-2"
            >
              {isProcessing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              {isProcessing ? 'Processing...' : 'Process Entities'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}