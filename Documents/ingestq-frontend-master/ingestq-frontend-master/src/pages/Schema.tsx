// import { useState } from "react";
// import { Database, ArrowRight, Plus, Minus, AlertTriangle, CheckCircle, Eye, Network, ArrowLeft } from "lucide-react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useNavigate } from "react-router-dom";

// // Mock data structures
// const mockSheets = ["Sheet1", "Sheet2", "Sheet3"];
// const mockTables = ["Table1", "Table2", "Table3"];

// // Mock schema data per source type
// const schemaData: Record<string, { currentSchema: SchemaColumn[], previousSchema: SchemaColumn[] }> = {
//   "Sheet1": {
//     currentSchema: [
//       { name: 'AccountID', type: 'INTEGER', nullable: false, status: 'existing', samples: ['1001', '1002', '1003'] },
//       { name: 'CustomerName', type: 'VARCHAR(255)', nullable: false, status: 'existing', samples: ['John Doe', 'Jane Smith', 'Bob Johnson'] },
//       { name: 'AccountType', type: 'VARCHAR(50)', nullable: false, status: 'existing', samples: ['Savings', 'Checking', 'Business'] },
//       { name: 'Balance', type: 'DECIMAL(10,2)', nullable: false, status: 'existing', samples: ['1250.50', '3400.00', '850.25'] },
//       { name: 'Status', type: 'VARCHAR(20)', nullable: false, status: 'existing', samples: ['Active', 'Inactive', 'Pending'] },
//       { name: 'Email', type: 'VARCHAR(255)', nullable: true, status: 'new', samples: ['john@email.com', 'jane@email.com', 'bob@email.com'] },
//       { name: 'Phone', type: 'VARCHAR(20)', nullable: true, status: 'new', samples: ['+1234567890', '+0987654321', '+1122334455'] },
//     ],
//     previousSchema: [
//       { name: 'AccountID', type: 'INTEGER', nullable: false, status: 'existing' },
//       { name: 'CustomerName', type: 'VARCHAR(255)', nullable: false, status: 'existing' },
//       { name: 'AccountType', type: 'VARCHAR(50)', nullable: false, status: 'existing' },
//       { name: 'Balance', type: 'DECIMAL(10,2)', nullable: false, status: 'existing' },
//       { name: 'Status', type: 'VARCHAR(20)', nullable: false, status: 'existing' },
//       { name: 'CreatedDate', type: 'DATE', nullable: false, status: 'deleted' },
//     ],
//   },
//   "Sheet2": {
//     currentSchema: [
//       { name: 'OrderID', type: 'INTEGER', nullable: false, status: 'existing', samples: ['5001', '5002', '5003'] },
//       { name: 'CustomerID', type: 'INTEGER', nullable: false, status: 'existing', samples: ['1001', '1002', '1003'] },
//       { name: 'OrderDate', type: 'DATE', nullable: false, status: 'existing', samples: ['2023-01-01', '2023-01-02', '2023-01-03'] },
//       { name: 'TotalAmount', type: 'DECIMAL(10,2)', nullable: false, status: 'existing', samples: ['99.99', '149.50', '75.00'] },
//     ],
//     previousSchema: [
//       { name: 'OrderID', type: 'INTEGER', nullable: false, status: 'existing' },
//       { name: 'CustomerID', type: 'INTEGER', nullable: false, status: 'existing' },
//       { name: 'OrderDate', type: 'DATE', nullable: false, status: 'existing' },
//       { name: 'Amount', type: 'DECIMAL(10,2)', nullable: false, status: 'deleted' },
//     ],
//   },
//   "Sheet3": {
//     currentSchema: [
//       { name: 'ProductID', type: 'INTEGER', nullable: false, status: 'existing', samples: ['2001', '2002', '2003'] },
//       { name: 'ProductName', type: 'VARCHAR(100)', nullable: false, status: 'existing', samples: ['Laptop', 'Phone', 'Tablet'] },
//       { name: 'Price', type: 'DECIMAL(10,2)', nullable: false, status: 'new', samples: ['999.99', '499.99', '299.99'] },
//     ],
//     previousSchema: [
//       { name: 'ProductID', type: 'INTEGER', nullable: false, status: 'existing' },
//       { name: 'ProductName', type: 'VARCHAR(100)', nullable: false, status: 'existing' },
//     ],
//   },
//   "Table1": {
//     currentSchema: [
//       { name: 'UserID', type: 'INTEGER', nullable: false, status: 'existing', samples: ['1', '2', '3'] },
//       { name: 'Username', type: 'VARCHAR(100)', nullable: false, status: 'existing', samples: ['user1', 'user2', 'user3'] },
//     ],
//     previousSchema: [
//       { name: 'UserID', type: 'INTEGER', nullable: false, status: 'existing' },
//       { name: 'Username', type: 'VARCHAR(100)', nullable: false, status: 'existing' },
//     ],
//   },
//   "Table2": {
//     currentSchema: [
//       { name: 'TransactionID', type: 'INTEGER', nullable: false, status: 'existing', samples: ['101', '102', '103'] },
//       { name: 'UserID', type: 'INTEGER', nullable: false, status: 'existing', samples: ['1', '2', '3'] },
//     ],
//     previousSchema: [
//       { name: 'TransactionID', type: 'INTEGER', nullable: false, status: 'existing' },
//       { name: 'UserID', type: 'INTEGER', nullable: false, status: 'existing' },
//     ],
//   },
//   "Table3": {
//     currentSchema: [
//       { name: 'ProductID', type: 'INTEGER', nullable: false, status: 'existing', samples: ['1001', '1002', '1003'] },
//       { name: 'ProductName', type: 'VARCHAR(100)', nullable: false, status: 'existing', samples: ['Item1', 'Item2', 'Item3'] },
//     ],
//     previousSchema: [
//       { name: 'ProductID', type: 'INTEGER', nullable: false, status: 'existing' },
//       { name: 'ProductName', type: 'VARCHAR(100)', nullable: false, status: 'existing' },
//     ],
//   },
//   "customers.csv": {
//     currentSchema: [
//       { name: 'CustomerID', type: 'INTEGER', nullable: false, status: 'existing', samples: ['1001', '1002', '1003'] },
//       { name: 'CustomerName', type: 'VARCHAR(255)', nullable: false, status: 'existing', samples: ['John Doe', 'Jane Smith', 'Bob Johnson'] },
//     ],
//     previousSchema: [
//       { name: 'CustomerID', type: 'INTEGER', nullable: false, status: 'existing' },
//       { name: 'CustomerName', type: 'VARCHAR(255)', nullable: false, status: 'existing' },
//     ],
//   },
// };

// // Mock data for preview per sheet/table
// const dummyData: Record<string, any[]> = {
//   "Sheet1": [
//     { AccountID: 1001, CustomerName: 'John Doe', AccountType: 'Savings', Balance: 1250.50, Status: 'Active', Email: 'john@email.com', Phone: '+1234567890' },
//     { AccountID: 1002, CustomerName: 'Jane Smith', AccountType: 'Checking', Balance: 3400.00, Status: 'Active', Email: 'jane@email.com', Phone: '+0987654321' },
//     { AccountID: 1003, CustomerName: 'Bob Johnson', AccountType: 'Business', Balance: 850.25, Status: 'Pending', Email: 'bob@email.com', Phone: '+1122334455' },
//     { AccountID: 1004, CustomerName: 'Alice Brown', AccountType: 'Savings', Balance: 2100.75, Status: 'Active', Email: 'alice@email.com', Phone: '+1555666777' },
//     { AccountID: 1005, CustomerName: 'Charlie Wilson', AccountType: 'Checking', Balance: 750.00, Status: 'Inactive', Email: 'charlie@email.com', Phone: '+1999888777' },
//   ],
//   "Sheet2": [
//     { OrderID: 5001, CustomerID: 1001, OrderDate: '2023-01-01', TotalAmount: 99.99 },
//     { OrderID: 5002, CustomerID: 1002, OrderDate: '2023-01-02', TotalAmount: 149.50 },
//     { OrderID: 5003, CustomerID: 1003, OrderDate: '2023-01-03', TotalAmount: 75.00 },
//     { OrderID: 5004, CustomerID: 1004, OrderDate: '2023-01-04', TotalAmount: 200.00 },
//     { OrderID: 5005, CustomerID: 1005, OrderDate: '2023-01-05', TotalAmount: 50.00 },
//   ],
//   "Sheet3": [
//     { ProductID: 2001, ProductName: 'Laptop', Price: 999.99 },
//     { ProductID: 2002, ProductName: 'Phone', Price: 499.99 },
//     { ProductID: 2003, ProductName: 'Tablet', Price: 299.99 },
//     { ProductID: 2004, ProductName: 'Headphones', Price: 89.99 },
//     { ProductID: 2005, ProductName: 'Monitor', Price: 199.99 },
//   ],
//   "Table1": [
//     { UserID: 1, Username: 'user1' },
//     { UserID: 2, Username: 'user2' },
//     { UserID: 3, Username: 'user3' },
//   ],
//   "Table2": [
//     { TransactionID: 101, UserID: 1 },
//     { TransactionID: 102, UserID: 2 },
//     { TransactionID: 103, UserID: 3 },
//   ],
//   "Table3": [
//     { ProductID: 1001, ProductName: 'Item1' },
//     { ProductID: 1002, ProductName: 'Item2' },
//     { ProductID: 1003, ProductName: 'Item3' },
//   ],
//   "customers.csv": [
//     { CustomerID: 1001, CustomerName: 'John Doe' },
//     { CustomerID: 1002, CustomerName: 'Jane Smith' },
//     { CustomerID: 1003, CustomerName: 'Bob Johnson' },
//   ],
// };

// // Mock relationship data per sheet
// const relationshipData: Record<string, { tables: any[], connections: any[] }> = {
//   "Sheet1": {
//     tables: [
//       {
//         name: 'customers.csv',
//         columns: [{ name: 'AccountID', isKey: true }],
//         position: { x: 100, y: 100 },
//       },
//       {
//         name: 'orders.csv',
//         columns: [
//           { name: 'CustomerID', isKey: true },
//           { name: 'ProductID', isKey: true },
//         ],
//         position: { x: 500, y: 100 },
//       },
//     ],
//     connections: [
//       {
//         id: 'rel1',
//         from: { table: 'customers.csv', column: 'AccountID' },
//         to: { table: 'orders.csv', column: 'CustomerID' },
//         type: '1:M',
//         description: 'One customer can have multiple orders',
//       },
//     ],
//   },
//   "Sheet2": {
//     tables: [
//       {
//         name: 'orders.csv',
//         columns: [
//           { name: 'CustomerID', isKey: true },
//           { name: 'ProductID', isKey: true },
//         ],
//         position: { x: 100, y: 100 },
//       },
//       {
//         name: 'products.csv',
//         columns: [{ name: 'ProductID', isKey: true }],
//         position: { x: 500, y: 100 },
//       },
//     ],
//     connections: [
//       {
//         id: 'rel2',
//         from: { table: 'orders.csv', column: 'ProductID' },
//         to: { table: 'products.csv', column: 'ProductID' },
//         type: 'M:1',
//         description: 'Multiple orders can reference one product',
//       },
//     ],
//   },
//   "Sheet3": {
//     tables: [
//       {
//         name: 'products.csv',
//         columns: [{ name: 'ProductID', isKey: true }],
//         position: { x: 100, y: 100 },
//       },
//     ],
//     connections: [],
//   },
//   "Table1": {
//     tables: [
//       {
//         name: 'users',
//         columns: [{ name: 'UserID', isKey: true }],
//         position: { x: 100, y: 100 },
//       },
//     ],
//     connections: [],
//   },
//   "Table2": {
//     tables: [
//       {
//         name: 'transactions',
//         columns: [{ name: 'TransactionID', isKey: true }, { name: 'UserID', isKey: false }],
//         position: { x: 100, y: 100 },
//       },
//     ],
//     connections: [],
//   },
//   "Table3": {
//     tables: [
//       {
//         name: 'products',
//         columns: [{ name: 'ProductID', isKey: true }],
//         position: { x: 100, y: 100 },
//       },
//     ],
//     connections: [],
//   },
//   "customers.csv": {
//     tables: [
//       {
//         name: 'customers.csv',
//         columns: [{ name: 'CustomerID', isKey: true }],
//         position: { x: 100, y: 100 },
//       },
//     ],
//     connections: [],
//   },
// };

// interface SchemaColumn {
//   name: string;
//   type: string;
//   nullable: boolean;
//   status: 'new' | 'existing' | 'modified' | 'deleted';
//   samples?: string[];
// }

// export default function Schema() {
//   const [selectedFile] = useState(() => {
//     return localStorage.getItem("selectedFile") || 'customer_data_v2.xlsx';
//   });
//   const [selectedSheet, setSelectedSheet] = useState<string>(mockSheets[0]);
//   const [selectedTable, setSelectedTable] = useState<string>(mockTables[0]);
//   const [showPreview, setShowPreview] = useState(false);
//   const [showRelationships, setShowRelationships] = useState(false);
//   const [hoveredRelationship, setHoveredRelationship] = useState<string | null>(null);
  
//   const navigate = useNavigate();

//   // Determine file type and appropriate data source
//   const fileExtension = selectedFile.split('.').pop()?.toLowerCase();
//   const isCsv = fileExtension === 'csv';
//   const isExcel = fileExtension === 'xlsx' || fileExtension === 'xls';
//   const isDatabase = fileExtension === 'db';
  
//   // Set current selection based on file type
//   const currentSelection = isCsv ? 'customers.csv' : isDatabase ? selectedTable : selectedSheet;
//   const availableSelections = isCsv ? ['customers.csv'] : isDatabase ? mockTables : mockSheets;
//   const displayName = isDatabase ? 'Database' : 'File';

//   const currentSchema = schemaData[currentSelection]?.currentSchema || [];
//   const previousSchema = schemaData[currentSelection]?.previousSchema || [];
//   const relationshipTables = relationshipData[currentSelection]?.tables || [];
//   const relationshipConnections = relationshipData[currentSelection]?.connections || [];

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'new': return 'bg-success text-success-foreground';
//       case 'deleted': return 'bg-destructive text-destructive-foreground';
//       case 'modified': return 'bg-warning text-warning-foreground';
//       default: return 'bg-muted text-muted-foreground';
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'new': return <Plus className="w-3 h-3" />;
//       case 'deleted': return <Minus className="w-3 h-3" />;
//       case 'modified': return <AlertTriangle className="w-3 h-3" />;
//       default: return <CheckCircle className="w-3 h-3" />;
//     }
//   };

//   const newColumns = currentSchema.filter(col => col.status === 'new');
//   const deletedColumns = previousSchema.filter(col => col.status === 'deleted');
//   const modifiedColumns = currentSchema.filter(col => col.status === 'modified');

//   const handleConfigureDQRules = () => {
//     navigate('/dashboard/rules');
//   };

//   const handleViewRelationships = () => {
//     setShowRelationships(true);
//   };

//   const handleBackToUpload = () => {
//     navigate('/dashboard/upload');
//   };

//   return (
//     <div className="max-w-7xl mt-14 mx-auto p-6 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Schema Analysis</h1>
//           <p className="text-muted-foreground">
//             Compare and analyze {isDatabase ? 'database' : 'file'} schemas for data quality validation
//           </p>
//         </div>
//         <div className="flex items-center space-x-4">
//           <div className="flex items-center space-x-2">
//             <Database className="w-5 h-5 text-primary" />
//             <span className="font-medium">{selectedFile}</span>
//           </div>
//           {!isCsv && (
//             <div className="w-48">
//               <Select 
//                 value={isDatabase ? selectedTable : selectedSheet} 
//                 onValueChange={isDatabase ? setSelectedTable : setSelectedSheet}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder={isDatabase ? "Select table" : "Select sheet"} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {availableSelections.map((item) => (
//                     <SelectItem key={item} value={item}>
//                       {item}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
//                 <Plus className="w-4 h-4 text-success" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-success">{newColumns.length}</p>
//                 <p className="text-xs text-muted-foreground">New Columns</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center">
//                 <Minus className="w-4 h-4 text-destructive" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-destructive">{deletedColumns.length}</p>
//                 <p className="text-xs text-muted-foreground">Deleted Columns</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
//                 <AlertTriangle className="w-4 h-4 text-warning" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-warning">{modifiedColumns.length}</p>
//                 <p className="text-xs text-muted-foreground">Modified Columns</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardContent className="p-4">
//             <div className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
//                 <Database className="w-4 h-4 text-primary" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-primary">{currentSchema.length}</p>
//                 <p className="text-xs text-muted-foreground">Total Columns</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <Tabs defaultValue="current" className="w-full">
//         <TabsList className="grid w-full grid-cols-3">
//           <TabsTrigger value="current">Current Schema</TabsTrigger>
//           <TabsTrigger value="previous">Previous Schema</TabsTrigger>
//           <TabsTrigger value="changes">Changes Summary</TabsTrigger>
//         </TabsList>
        
//         <TabsContent value="current" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Current Schema Structure ({currentSelection})</CardTitle>
//               <CardDescription>
//                 Schema detected from the selected {isDatabase ? 'table' : isCsv ? 'CSV file' : 'sheet'}
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Column Name</TableHead>
//                     <TableHead>Data Type</TableHead>
//                     <TableHead>Nullable</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Sample Values</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {currentSchema.map((column, index) => (
//                     <TableRow key={index}>
//                       <TableCell className="font-medium">{column.name}</TableCell>
//                       <TableCell>
//                         <Badge variant="outline">{column.type}</Badge>
//                       </TableCell>
//                       <TableCell>
//                         <Badge variant={column.nullable ? "destructive" : "default"}>
//                           {column.nullable ? "Yes" : "No"}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         <Badge className={getStatusColor(column.status)}>
//                           <span className="flex items-center space-x-1">
//                             {getStatusIcon(column.status)}
//                             <span className="capitalize">{column.status}</span>
//                           </span>
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         {column.samples && (
//                           <div className="flex flex-wrap gap-1">
//                             {column.samples.slice(0, 3).map((sample, idx) => (
//                               <Badge key={idx} variant="secondary" className="text-xs">
//                                 {sample}
//                               </Badge>
//                             ))}
//                           </div>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>
        
//         <TabsContent value="previous" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Previous Schema Structure ({currentSelection})</CardTitle>
//               <CardDescription>
//                 Last known schema structure for comparison
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Column Name</TableHead>
//                     <TableHead>Data Type</TableHead>
//                     <TableHead>Nullable</TableHead>
//                     <TableHead>Status</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {previousSchema.map((column, index) => (
//                     <TableRow key={index}>
//                       <TableCell className="font-medium">{column.name}</TableCell>
//                       <TableCell>
//                         <Badge variant="outline">{column.type}</Badge>
//                       </TableCell>
//                       <TableCell>
//                         <Badge variant={column.nullable ? "destructive" : "default"}>
//                           {column.nullable ? "Yes" : "No"}
//                         </Badge>
//                       </TableCell>
//                       <TableCell>
//                         <Badge className={getStatusColor(column.status)}>
//                           <span className="flex items-center space-x-1">
//                             {getStatusIcon(column.status)}
//                             <span className="capitalize">{column.status}</span>
//                           </span>
//                         </Badge>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>
        
//         <TabsContent value="changes" className="space-y-4">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//             {newColumns.length > 0 && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center space-x-2">
//                     <Plus className="w-5 h-5 text-success" />
//                     <span>New Columns ({newColumns.length})</span>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2">
//                     {newColumns.map((column, index) => (
//                       <div key={index} className="flex items-center justify-between p-2 bg-success/5 rounded-lg border border-success/20">
//                         <div>
//                           <p className="font-medium">{column.name}</p>
//                           <p className="text-xs text-muted-foreground">{column.type}</p>
//                         </div>
//                         <Badge className="bg-success text-success-foreground">New</Badge>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
            
//             {deletedColumns.length > 0 && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center space-x-2">
//                     <Minus className="w-5 h-5 text-destructive" />
//                     <span>Deleted Columns ({deletedColumns.length})</span>
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2">
//                     {deletedColumns.map((column, index) => (
//                       <div key={index} className="flex items-center justify-between p-2 bg-destructive/5 rounded-lg border border-destructive/20">
//                         <div>
//                           <p className="font-medium">{column.name}</p>
//                           <p className="text-xs text-muted-foreground">{column.type}</p>
//                         </div>
//                         <Badge className="bg-destructive text-destructive-foreground">Deleted</Badge>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </TabsContent>
//       </Tabs>

//       <div className="flex justify-between items-center">
//         <Button variant="outline" onClick={handleBackToUpload}>
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back to Upload
//         </Button>
        
//         <div className="flex space-x-2">
//           <Button variant="outline" onClick={() => setShowPreview(true)}>
//             <Eye className="w-4 h-4 mr-2" />
//             Preview Data
//           </Button>
          
//           <Button variant="outline" onClick={handleViewRelationships}>
//             <Network className="w-4 h-4 mr-2" />
//             View Relationships
//           </Button>
          
//           <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleConfigureDQRules}>
//             <ArrowRight className="w-4 h-4 mr-2" />
//             Configure DQ Rules
//           </Button>
//         </div>
//       </div>

//       <Dialog open={showPreview} onOpenChange={setShowPreview}>
//         <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Data Preview - {selectedFile} ({currentSelection})</DialogTitle>
//             <DialogDescription>
//               Sample data from the selected {isDatabase ? 'table' : isCsv ? 'CSV file' : 'sheet'} (showing first 5 rows)
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-4">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   {currentSchema.map((column) => (
//                     <TableHead key={column.name}>{column.name}</TableHead>
//                   ))}
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {dummyData[currentSelection].map((row, index) => (
//                   <TableRow key={index}>
//                     {currentSchema.map((column) => (
//                       <TableCell key={column.name}>{row[column.name]}</TableCell>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
            
//             <div className="text-center">
//               <Button onClick={() => setShowPreview(false)}>
//                 Close Preview
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={showRelationships} onOpenChange={setShowRelationships}>
//         <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="text-xl font-semibold">Table Relationships ({currentSelection})</DialogTitle>
//             <DialogDescription>
//               Relationships for data in {currentSelection}
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-8">
//             <div className="flex justify-center">
//               <Badge className="bg-green-100 text-green-700 border-green-300">
//                 <CheckCircle className="w-3 h-3 mr-1" />
//                 {relationshipConnections.length} Relationship{relationshipConnections.length !== 1 ? 's' : ''} Detected
//               </Badge>
//             </div>

//             <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-12 min-h-[300px] border border-slate-200">
//               {relationshipTables.map((table, index) => (
//                 <div
//                   key={table.name}
//                   className="absolute"
//                   style={{ left: table.position.x, top: table.position.y }}
//                 >
//                   <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6 w-48">
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="font-semibold text-slate-800">{table.name}</h3>
//                       <Database className="w-5 h-5 text-blue-500" />
//                     </div>
//                     <div className="space-y-2">
//                       {table.columns.map((col: any, idx: number) => (
//                         <div key={idx} className="flex items-center justify-between">
//                           <div className="flex items-center space-x-2">
//                             <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                             <span className="text-sm font-medium text-slate-700">{col.name}</span>
//                           </div>
//                           <Badge variant="outline" className="text-xs">{col.isKey ? 'PK' : 'FK'}</Badge>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               ))}

//               <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
//                 {relationshipConnections.map((conn, index) => {
//                   const fromTable = relationshipTables.find(t => t.name === conn.from.table);
//                   const toTable = relationshipTables.find(t => t.name === conn.to.table);
//                   if (!fromTable || !toTable) return null;
//                   return (
//                     <g key={conn.id}>
//                       <line
//                         x1={fromTable.position.x + 200}
//                         y1={fromTable.position.y + 50}
//                         x2={toTable.position.x}
//                         y2={toTable.position.y + 50}
//                         stroke="#3b82f6"
//                         strokeWidth="3"
//                         className="transition-all duration-200"
//                         style={{ pointerEvents: 'all' }}
//                         onMouseEnter={() => setHoveredRelationship(conn.id)}
//                         onMouseLeave={() => setHoveredRelationship(null)}
//                       />
//                       <circle cx={fromTable.position.x + 200} cy={fromTable.position.y + 50} r="5" fill="#3b82f6" />
//                       <circle cx={toTable.position.x} cy={toTable.position.y + 50} r="5" fill="#3b82f6" />
                      
//                       {hoveredRelationship === conn.id && (
//                         <g>
//                           <rect
//                             x={(fromTable.position.x + toTable.position.x + 200) / 2 - 25}
//                             y={(fromTable.position.y + toTable.position.y + 100) / 2 - 15}
//                             width="50"
//                             height="30"
//                             rx="6"
//                             fill="#1f2937"
//                             className="animate-fade-in"
//                           />
//                           <text
//                             x={(fromTable.position.x + toTable.position.x + 200) / 2}
//                             y={(fromTable.position.y + toTable.position.y + 100) / 2}
//                             textAnchor="middle"
//                             className="text-sm font-medium fill-white"
//                             dy="0.3em"
//                           >
//                             {conn.type}
//                           </text>
//                         </g>
//                       )}
//                     </g>
//                   );
//                 })}
//               </svg>
//             </div>

//             {relationshipConnections.map((conn) => (
//               <div key={conn.id} className="flex justify-center">
//                 <Card className="w-96">
//                   <CardHeader>
//                     <CardTitle className="flex items-center space-x-2">
//                       <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
//                       <span>{conn.from.table} - {conn.to.table}</span>
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-2">
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-muted-foreground">Relationship Type</span>
//                         <Badge variant="outline">{conn.type}</Badge>
//                       </div>
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-muted-foreground">Linking Column</span>
//                         <Badge variant="secondary">{conn.from.column}</Badge>
//                       </div>
//                       <p className="text-sm text-slate-600 mt-2">
//                         {conn.description}
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             ))}
            
//             <div className="text-center">
//               <Button onClick={() => setShowRelationships(false)} className="bg-blue-600 hover:bg-blue-700 text-white">
//                 Continue
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


//--------------------------------------------------------------------------------------------------


import { useState, useEffect } from "react";
import { Database, ArrowRight, Plus, Minus, AlertTriangle, CheckCircle, Eye, Network, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { runSchemaAnalysis, previewData, viewRelationship, SchemaAnalysisResponse, PreviewDataResponse, RelationshipResponse } from '@/lib/api';
import { toast } from "@/components/ui/use-toast"; // Assuming toast component for user feedback

// Mock data structures (kept for non-CSV, but will be overridden for CSV)
const mockSheets = ["Sheet1", "Sheet2", "Sheet3"];
const mockTables = ["Table1", "Table2", "Table3"];

// Mock schema data per source type (fallback for non-CSV)
const schemaData: Record<string, { currentSchema: SchemaColumn[], previousSchema: SchemaColumn[] }> = {
  "Sheet1": {
    currentSchema: [
      { name: 'AccountID', type: 'INTEGER', nullable: false, status: 'existing', samples: ['1001', '1002', '1003'] },
      { name: 'CustomerName', type: 'VARCHAR(255)', nullable: false, status: 'existing', samples: ['John Doe', 'Jane Smith', 'Bob Johnson'] },
      { name: 'AccountType', type: 'VARCHAR(50)', nullable: false, status: 'existing', samples: ['Savings', 'Checking', 'Business'] },
      { name: 'Balance', type: 'DECIMAL(10,2)', nullable: false, status: 'existing', samples: ['1250.50', '3400.00', '850.25'] },
      { name: 'Status', type: 'VARCHAR(20)', nullable: false, status: 'existing', samples: ['Active', 'Inactive', 'Pending'] },
      { name: 'Email', type: 'VARCHAR(255)', nullable: true, status: 'new', samples: ['john@email.com', 'jane@email.com', 'bob@email.com'] },
      { name: 'Phone', type: 'VARCHAR(20)', nullable: true, status: 'new', samples: ['+1234567890', '+0987654321', '+1122334455'] },
    ],
    previousSchema: [
      { name: 'AccountID', type: 'INTEGER', nullable: false, status: 'existing' },
      { name: 'CustomerName', type: 'VARCHAR(255)', nullable: false, status: 'existing' },
      { name: 'AccountType', type: 'VARCHAR(50)', nullable: false, status: 'existing' },
      { name: 'Balance', type: 'DECIMAL(10,2)', nullable: false, status: 'existing' },
      { name: 'Status', type: 'VARCHAR(20)', nullable: false, status: 'existing' },
      { name: 'CreatedDate', type: 'DATE', nullable: false, status: 'deleted' },
    ],
  },
  "Sheet2": {
    currentSchema: [
      { name: 'OrderID', type: 'INTEGER', nullable: false, status: 'existing', samples: ['5001', '5002', '5003'] },
      { name: 'CustomerID', type: 'INTEGER', nullable: false, status: 'existing', samples: ['1001', '1002', '1003'] },
      { name: 'OrderDate', type: 'DATE', nullable: false, status: 'existing', samples: ['2023-01-01', '2023-01-02', '2023-01-03'] },
      { name: 'TotalAmount', type: 'DECIMAL(10,2)', nullable: false, status: 'existing', samples: ['99.99', '149.50', '75.00'] },
    ],
    previousSchema: [
      { name: 'OrderID', type: 'INTEGER', nullable: false, status: 'existing' },
      { name: 'CustomerID', type: 'INTEGER', nullable: false, status: 'existing' },
      { name: 'OrderDate', type: 'DATE', nullable: false, status: 'existing' },
      { name: 'Amount', type: 'DECIMAL(10,2)', nullable: false, status: 'deleted' },
    ],
  },
  "Sheet3": {
    currentSchema: [
      { name: 'ProductID', type: 'INTEGER', nullable: false, status: 'existing', samples: ['2001', '2002', '2003'] },
      { name: 'ProductName', type: 'VARCHAR(100)', nullable: false, status: 'existing', samples: ['Laptop', 'Phone', 'Tablet'] },
      { name: 'Price', type: 'DECIMAL(10,2)', nullable: false, status: 'new', samples: ['999.99', '499.99', '299.99'] },
    ],
    previousSchema: [
      { name: 'ProductID', type: 'INTEGER', nullable: false, status: 'existing' },
      { name: 'ProductName', type: 'VARCHAR(100)', nullable: false, status: 'existing' },
    ],
  },
  "Table1": {
    currentSchema: [
      { name: 'UserID', type: 'INTEGER', nullable: false, status: 'existing', samples: ['1', '2', '3'] },
      { name: 'Username', type: 'VARCHAR(100)', nullable: false, status: 'existing', samples: ['user1', 'user2', 'user3'] },
    ],
    previousSchema: [
      { name: 'UserID', type: 'INTEGER', nullable: false, status: 'existing' },
      { name: 'Username', type: 'VARCHAR(100)', nullable: false, status: 'existing' },
    ],
  },
  "Table2": {
    currentSchema: [
      { name: 'TransactionID', type: 'INTEGER', nullable: false, status: 'existing', samples: ['101', '102', '103'] },
      { name: 'UserID', type: 'INTEGER', nullable: false, status: 'existing', samples: ['1', '2', '3'] },
    ],
    previousSchema: [
      { name: 'TransactionID', type: 'INTEGER', nullable: false, status: 'existing' },
      { name: 'UserID', type: 'INTEGER', nullable: false, status: 'existing' },
    ],
  },
  "Table3": {
    currentSchema: [
      { name: 'ProductID', type: 'INTEGER', nullable: false, status: 'existing', samples: ['1001', '1002', '1003'] },
      { name: 'ProductName', type: 'VARCHAR(100)', nullable: false, status: 'existing', samples: ['Item1', 'Item2', 'Item3'] },
    ],
    previousSchema: [
      { name: 'ProductID', type: 'INTEGER', nullable: false, status: 'existing' },
      { name: 'ProductName', type: 'VARCHAR(100)', nullable: false, status: 'existing' },
    ],
  },
};

// Mock data for preview per sheet/table (fallback for non-CSV)
const dummyData: Record<string, any[]> = {
  "Sheet1": [
    { AccountID: 1001, CustomerName: 'John Doe', AccountType: 'Savings', Balance: 1250.50, Status: 'Active', Email: 'john@email.com', Phone: '+1234567890' },
    { AccountID: 1002, CustomerName: 'Jane Smith', AccountType: 'Checking', Balance: 3400.00, Status: 'Active', Email: 'jane@email.com', Phone: '+0987654321' },
    { AccountID: 1003, CustomerName: 'Bob Johnson', AccountType: 'Business', Balance: 850.25, Status: 'Pending', Email: 'bob@email.com', Phone: '+1122334455' },
    { AccountID: 1004, CustomerName: 'Alice Brown', AccountType: 'Savings', Balance: 2100.75, Status: 'Active', Email: 'alice@email.com', Phone: '+1555666777' },
    { AccountID: 1005, CustomerName: 'Charlie Wilson', AccountType: 'Checking', Balance: 750.00, Status: 'Inactive', Email: 'charlie@email.com', Phone: '+1999888777' },
  ],
  "Sheet2": [
    { OrderID: 5001, CustomerID: 1001, OrderDate: '2023-01-01', TotalAmount: 99.99 },
    { OrderID: 5002, CustomerID: 1002, OrderDate: '2023-01-02', TotalAmount: 149.50 },
    { OrderID: 5003, CustomerID: 1003, OrderDate: '2023-01-03', TotalAmount: 75.00 },
    { OrderID: 5004, CustomerID: 1004, OrderDate: '2023-01-04', TotalAmount: 200.00 },
    { OrderID: 5005, CustomerID: 1005, OrderDate: '2023-01-05', TotalAmount: 50.00 },
  ],
  "Sheet3": [
    { ProductID: 2001, ProductName: 'Laptop', Price: 999.99 },
    { ProductID: 2002, ProductName: 'Phone', Price: 499.99 },
    { ProductID: 2003, ProductName: 'Tablet', Price: 299.99 },
    { ProductID: 2004, ProductName: 'Headphones', Price: 89.99 },
    { ProductID: 2005, ProductName: 'Monitor', Price: 199.99 },
  ],
  "Table1": [
    { UserID: 1, Username: 'user1' },
    { UserID: 2, Username: 'user2' },
    { UserID: 3, Username: 'user3' },
  ],
  "Table2": [
    { TransactionID: 101, UserID: 1 },
    { TransactionID: 102, UserID: 2 },
    { TransactionID: 103, UserID: 3 },
  ],
  "Table3": [
    { ProductID: 1001, ProductName: 'Item1' },
    { ProductID: 1002, ProductName: 'Item2' },
    { ProductID: 1003, ProductName: 'Item3' },
  ],
};

// Mock relationship data per sheet (fallback for non-CSV)
const relationshipData: Record<string, { tables: any[], connections: any[] }> = {
  "Sheet1": {
    tables: [
      {
        name: 'Book1.csv',
        columns: [{ name: 'AccountID', isKey: true }],
        position: { x: 100, y: 100 },
      },
      {
        name: 'orders.csv',
        columns: [
          { name: 'CustomerID', isKey: true },
          { name: 'ProductID', isKey: true },
        ],
        position: { x: 500, y: 100 },
      },
    ],
    connections: [
      {
        id: 'rel1',
        from: { table: 'Book1.csv', column: 'AccountID' },
        to: { table: 'orders.csv', column: 'CustomerID' },
        type: '1:M',
        description: 'One customer can have multiple orders',
      },
    ],
  },
  "Sheet2": {
    tables: [
      {
        name: 'orders.csv',
        columns: [
          { name: 'CustomerID', isKey: true },
          { name: 'ProductID', isKey: true },
        ],
        position: { x: 100, y: 100 },
      },
      {
        name: 'products.csv',
        columns: [{ name: 'ProductID', isKey: true }],
        position: { x: 500, y: 100 },
      },
    ],
    connections: [
      {
        id: 'rel2',
        from: { table: 'orders.csv', column: 'ProductID' },
        to: { table: 'products.csv', column: 'ProductID' },
        type: 'M:1',
        description: 'Multiple orders can reference one product',
      },
    ],
  },
  "Sheet3": {
    tables: [
      {
        name: 'products.csv',
        columns: [{ name: 'ProductID', isKey: true }],
        position: { x: 100, y: 100 },
      },
    ],
    connections: [],
  },
  "Table1": {
    tables: [
      {
        name: 'users',
        columns: [{ name: 'UserID', isKey: true }],
        position: { x: 100, y: 100 },
      },
    ],
    connections: [],
  },
  "Table2": {
    tables: [
      {
        name: 'transactions',
        columns: [{ name: 'TransactionID', isKey: true }, { name: 'UserID', isKey: false }],
        position: { x: 100, y: 100 },
      },
    ],
    connections: [],
  },
  "Table3": {
    tables: [
      {
        name: 'products',
        columns: [{ name: 'ProductID', isKey: true }],
        position: { x: 100, y: 100 },
      },
    ],
    connections: [],
  },
};

interface SchemaColumn {
  name: string;
  type: string;
  nullable: boolean;
  status: 'new' | 'existing' | 'modified' | 'deleted';
  samples?: string[];
}

export default function Schema() {
  const navigate = useNavigate();

  // Validate selectedFile on component mount
  const [selectedFile] = useState(() => {
    const file = localStorage.getItem("selectedFile");
    if (!file) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No file selected. Please upload a file.",
      });
      navigate('/dashboard/upload');
      return '';
    }
    return file || 'Book1.csv';
  });

  // Determine file type and appropriate data source
  const fileExtension = selectedFile.split('.').pop()?.toLowerCase();
  const isCsv = fileExtension === 'csv';
  const isExcel = fileExtension === 'xlsx' || fileExtension === 'xls';
  const isDatabase = fileExtension === 'db';

  const [selectedSheet, setSelectedSheet] = useState<string>(mockSheets[0]);
  const [selectedTable, setSelectedTable] = useState<string>(mockTables[0]);
  const [showPreview, setShowPreview] = useState(false);
  const [showRelationships, setShowRelationships] = useState(false);
  const [hoveredRelationship, setHoveredRelationship] = useState<string | null>(null);
  const [schemaDataState, setSchemaDataState] = useState<Record<string, { currentSchema: SchemaColumn[], previousSchema: SchemaColumn[] }>>(isCsv ? {} : schemaData);
  const [previewDataState, setPreviewDataState] = useState<Record<string, any[]>>(isCsv ? {} : dummyData);
  const [relationshipDataState, setRelationshipDataState] = useState<Record<string, { tables: any[], connections: any[] }>>(isCsv ? {} : relationshipData);

  // Set current selection based on file type
  const currentSelection = isCsv ? selectedFile : isDatabase ? selectedTable : selectedSheet;
  const availableSelections = isCsv ? [selectedFile] : isDatabase ? mockTables : mockSheets;
  const displayName = isDatabase ? 'Database' : 'File';

  const currentSchema = schemaDataState[currentSelection]?.currentSchema || [];
  const previousSchema = schemaDataState[currentSelection]?.previousSchema || [];
  const relationshipTables = relationshipDataState[currentSelection]?.tables || [];
  const relationshipConnections = relationshipDataState[currentSelection]?.connections || [];

  // Helper function to validate localStorage values
  const validateLocalStorage = () => {
    const bucket = localStorage.getItem('selectedBucket');
    const key = localStorage.getItem('selectedFile');
    if (!bucket || !key) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-success text-success-foreground';
      case 'deleted': return 'bg-destructive text-destructive-foreground';
      case 'modified': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Plus className="w-3 h-3" />;
      case 'deleted': return <Minus className="w-3 h-3" />;
      case 'modified': return <AlertTriangle className="w-3 h-3" />;
      default: return <CheckCircle className="w-3 h-3" />;
    }
  };

  const newColumns = currentSchema.filter(col => col.status === 'new');
  const deletedColumns = previousSchema.filter(col => col.status === 'deleted');
  const modifiedColumns = currentSchema.filter(col => col.status === 'modified');

  const handleConfigureDQRules = () => {
    navigate('/dashboard/rules');
  };

  const handleViewRelationshipsClick = () => {
    if (!isCsv) {
      setShowRelationships(true);
      return;
    }

    const validated = validateLocalStorage();
    if (!validated) return;

    const { bucket, key } = validated;

    viewRelationship({ bucket_name: bucket, key }).then((res: RelationshipResponse) => {
      if (res.success && res.relationships) {
        // Convert relationships to an array if it's an object
        const rels = Array.isArray(res.relationships) ? res.relationships : [res.relationships];
        const uniqueTables = new Set<string>();
        rels.forEach(r => {
          uniqueTables.add(r.file1);
          uniqueTables.add(r.file2);
        });

        const tables = Array.from(uniqueTables).map((name, idx) => {
          const cols = rels
            .filter(r => r.file1 === name || r.file2 === name)
            .map(r => ({ name: r.column, isKey: r.file1 === name }));

          const colSet = new Set(cols.map(c => c.name));
          const uniqueCols = Array.from(colSet).map(colName => ({
            name: colName,
            isKey: cols.find(c => c.name === colName && c.isKey) ? true : false,
          }));

          return {
            name,
            columns: uniqueCols,
            position: { x: idx * 400 + 100, y: 100 },
          };
        });

        const connections = rels.map((r, idx) => ({
          id: `rel${idx + 1}`,
          from: { table: r.file1, column: r.column },
          to: { table: r.file2, column: r.column },
          type: '1:M',
          description: `One ${r.file1} to many ${r.file2} via ${r.column}`,
        }));

        setRelationshipDataState(prev => ({
          ...prev,
          [currentSelection]: { tables, connections },
        }));
        setShowRelationships(true);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch relationships. Please try again.",
        });
      }
    }).catch(err => {
      console.error('Error fetching relationships:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while fetching relationships.",
      });
    });
  };

  const handlePreviewClick = () => {
    if (!isCsv) {
      setShowPreview(true);
      return;
    }

    const validated = validateLocalStorage();
    if (!validated) return;

    const { bucket, key } = validated;

    previewData({ bucket_name: bucket, key }).then((res: PreviewDataResponse) => {
      if (res.success && res.data) {
        setPreviewDataState(prev => ({
          ...prev,
          [currentSelection]: res.data.rows ?? [],
        }));
        setShowPreview(true);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch preview data. Please try again.",
        });
      }
    }).catch(err => {
      console.error('Error fetching preview data:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while fetching preview data.",
      });
    });
  };

  const handleBackToUpload = () => {
    navigate('/dashboard/upload');
  };

  useEffect(() => {
    if (!isCsv) return;

    const validated = validateLocalStorage();
    if (!validated) return;

    const { bucket, key } = validated;

    runSchemaAnalysis({ bucket_name: bucket, key }).then((res: SchemaAnalysisResponse) => {
      if (!res.success || !res.lambda_response?.results) {
        console.error('Failed to fetch schema analysis');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch schema analysis. Please try again.",
        });
        return;
      }

      const results = res.lambda_response.results;
      const sheet = Object.keys(results)[0]; // Assume single sheet for CSV

      const resSheet = results[sheet];
      const newCols = resSheet.Changes.NewColumn_names || [];
      const missingCols = resSheet.Changes.MissingColumn_names || [];
      const currentMap = resSheet.CurrentSchema || {};
      const prevMap = resSheet.PreviousSchema || {};
      const samples = resSheet.Samples || {};
      const nullable = resSheet.Nullable || {};

      const currentSchemaArr: SchemaColumn[] = Object.entries(currentMap).map(([name, type]: any) => ({
        name,
        type,
        nullable: nullable[name] ?? false,
        status: newCols.includes(name) ? 'new' :
          (prevMap[name] && prevMap[name] !== type ? 'modified' : 'existing'),
        samples: samples[name] ?? [],
      }));

      const previousSchemaArr: SchemaColumn[] = Object.entries(prevMap).map(([name, type]: any) => ({
        name,
        type,
        nullable: missingCols.includes(name) ? false : (nullable[name] ?? false),
        status: missingCols.includes(name) ? 'deleted' :
          (currentMap[name] && currentMap[name] !== type ? 'modified' : 'existing'),
      }));

      setSchemaDataState(prev => ({
        ...prev,
        [currentSelection]: {
          currentSchema: currentSchemaArr,
          previousSchema: previousSchemaArr,
        },
      }));
    }).catch(err => {
      console.error('Error fetching schema:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while fetching schema data.",
      });
    });
  }, [isCsv, currentSelection, navigate]);

  return (
    <div className="max-w-7xl mt-14 mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Schema Analysis</h1>
          <p className="text-muted-foreground">
            Compare and analyze {isDatabase ? 'database' : 'file'} schemas for data quality validation
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-primary" />
            <span className="font-medium">{selectedFile}</span>
          </div>
          {!isCsv && (
            <div className="w-48">
              <Select 
                value={isDatabase ? selectedTable : selectedSheet} 
                onValueChange={isDatabase ? setSelectedTable : setSelectedSheet}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isDatabase ? "Select table" : "Select sheet"} />
                </SelectTrigger>
                <SelectContent>
                  {availableSelections.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                <Plus className="w-4 h-4 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{newColumns.length}</p>
                <p className="text-xs text-muted-foreground">New Columns</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center">
                <Minus className="w-4 h-4 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{deletedColumns.length}</p>
                <p className="text-xs text-muted-foreground">Deleted Columns</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{modifiedColumns.length}</p>
                <p className="text-xs text-muted-foreground">Modified Columns</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Database className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{currentSchema.length}</p>
                <p className="text-xs text-muted-foreground">Total Columns</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Schema</TabsTrigger>
          <TabsTrigger value="previous">Previous Schema</TabsTrigger>
          <TabsTrigger value="changes">Changes Summary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Schema Structure ({currentSelection})</CardTitle>
              <CardDescription>
                Schema detected from the selected {isDatabase ? 'table' : isCsv ? 'CSV file' : 'sheet'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Column Name</TableHead>
                    <TableHead>Data Type</TableHead>
                    <TableHead>Nullable</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sample Values</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSchema.map((column, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{column.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{column.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={column.nullable ? "destructive" : "default"}>
                          {column.nullable ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(column.status)}>
                          <span className="flex items-center space-x-1">
                            {getStatusIcon(column.status)}
                            <span className="capitalize">{column.status}</span>
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {column.samples && (
                          <div className="flex flex-wrap gap-1">
                            {column.samples.slice(0, 3).map((sample, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {sample}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="previous" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Previous Schema Structure ({currentSelection})</CardTitle>
              <CardDescription>
                Last known schema structure for comparison
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Column Name</TableHead>
                    <TableHead>Data Type</TableHead>
                    <TableHead>Nullable</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previousSchema.map((column, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{column.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{column.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={column.nullable ? "destructive" : "default"}>
                          {column.nullable ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(column.status)}>
                          <span className="flex items-center space-x-1">
                            {getStatusIcon(column.status)}
                            <span className="capitalize">{column.status}</span>
                          </span>
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="changes" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {newColumns.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="w-5 h-5 text-success" />
                    <span>New Columns ({newColumns.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {newColumns.map((column, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-success/5 rounded-lg border border-success/20">
                        <div>
                          <p className="font-medium">{column.name}</p>
                          <p className="text-xs text-muted-foreground">{column.type}</p>
                        </div>
                        <Badge className="bg-success text-success-foreground">New</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {deletedColumns.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Minus className="w-5 h-5 text-destructive" />
                    <span>Deleted Columns ({deletedColumns.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {deletedColumns.map((column, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-destructive/5 rounded-lg border border-destructive/20">
                        <div>
                          <p className="font-medium">{column.name}</p>
                          <p className="text-xs text-muted-foreground">{column.type}</p>
                        </div>
                        <Badge className="bg-destructive text-destructive-foreground">Deleted</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {modifiedColumns.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    <span>Modified Columns ({modifiedColumns.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {modifiedColumns.map((column, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-warning/5 rounded-lg border border-warning/20">
                        <div>
                          <p className="font-medium">{column.name}</p>
                          <p className="text-xs text-muted-foreground">{column.type}</p>
                        </div>
                        <Badge className="bg-warning text-warning-foreground">Modified</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={handleBackToUpload}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Upload
        </Button>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePreviewClick}>
            <Eye className="w-4 h-4 mr-2" />
            Preview Data
          </Button>
          
          <Button variant="outline" onClick={handleViewRelationshipsClick}>
            <Network className="w-4 h-4 mr-2" />
            View Relationships
          </Button>
          
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleConfigureDQRules}>
            <ArrowRight className="w-4 h-4 mr-2" />
            Configure DQ Rules
          </Button>
        </div>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Data Preview - {selectedFile} ({currentSelection})</DialogTitle>
            <DialogDescription>
              Sample data from the selected {isDatabase ? 'table' : isCsv ? 'CSV file' : 'sheet'} (showing first 5 rows)
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  {currentSchema.map((column) => (
                    <TableHead key={column.name}>{column.name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewDataState[currentSelection]?.slice(0, 5).map((row, index) => (
                  <TableRow key={index}>
                    {currentSchema.map((column) => (
                      <TableCell key={column.name}>{row[column.name] ?? ''}</TableCell>
                    ))}
                  </TableRow>
                )) || (
                  <TableRow>
                    <TableCell colSpan={currentSchema.length}>No data available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            <div className="text-center">
              <Button onClick={() => setShowPreview(false)}>
                Close Preview
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showRelationships} onOpenChange={setShowRelationships}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Table Relationships ({currentSelection})</DialogTitle>
            <DialogDescription>
              Relationships for data in {currentSelection}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8">
            <div className="flex justify-center">
              <Badge className="bg-green-100 text-green-700 border-green-300">
                <CheckCircle className="w-3 h-3 mr-1" />
                {relationshipConnections.length} Relationship{relationshipConnections.length !== 1 ? 's' : ''} Detected
              </Badge>
            </div>

            <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-12 min-h-[300px] border border-slate-200">
              {relationshipTables.map((table, index) => (
                <div
                  key={table.name}
                  className="absolute"
                  style={{ left: table.position.x, top: table.position.y }}
                >
                  <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-6 w-48">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-slate-800">{table.name}</h3>
                      <Database className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="space-y-2">
                      {table.columns.map((col: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-medium text-slate-700">{col.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">{col.isKey ? 'PK' : 'FK'}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                {relationshipConnections.map((conn, index) => {
                  const fromTable = relationshipTables.find(t => t.name === conn.from.table);
                  const toTable = relationshipTables.find(t => t.name === conn.to.table);
                  if (!fromTable || !toTable) return null;
                  return (
                    <g key={conn.id}>
                      <line
                        x1={fromTable.position.x + 200}
                        y1={fromTable.position.y + 50}
                        x2={toTable.position.x}
                        y2={toTable.position.y + 50}
                        stroke="#3b82f6"
                        strokeWidth="3"
                        className="transition-all duration-200"
                        style={{ pointerEvents: 'all' }}
                        onMouseEnter={() => setHoveredRelationship(conn.id)}
                        onMouseLeave={() => setHoveredRelationship(null)}
                      />
                      <circle cx={fromTable.position.x + 200} cy={fromTable.position.y + 50} r="5" fill="#3b82f6" />
                      <circle cx={toTable.position.x} cy={toTable.position.y + 50} r="5" fill="#3b82f6" />
                      
                      {hoveredRelationship === conn.id && (
                        <g>
                          <rect
                            x={(fromTable.position.x + toTable.position.x + 200) / 2 - 25}
                            y={(fromTable.position.y + toTable.position.y + 100) / 2 - 15}
                            width="50"
                            height="30"
                            rx="6"
                            fill="#1f2937"
                            className="animate-fade-in"
                          />
                          <text
                            x={(fromTable.position.x + toTable.position.x + 200) / 2}
                            y={(fromTable.position.y + toTable.position.y + 100) / 2}
                            textAnchor="middle"
                            className="text-sm font-medium fill-white"
                            dy="0.3em"
                          >
                            {conn.type}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {relationshipConnections.map((conn) => (
              <div key={conn.id} className="flex justify-center">
                <Card className="w-96">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span>{conn.from.table} - {conn.to.table}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Relationship Type</span>
                        <Badge variant="outline">{conn.type}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Linking Column</span>
                        <Badge variant="secondary">{conn.from.column}</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mt-2">
                        {conn.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
            
            <div className="text-center">
              <Button onClick={() => setShowRelationships(false)} className="bg-blue-600 hover:bg-blue-700 text-white">
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}