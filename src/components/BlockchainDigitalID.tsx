import { useState, useEffect } from "react";
import { Shield, User, Phone, MapPin, Calendar, Building, Ticket, Key, Lock, Globe, Download, Upload, QrCode, Smartphone, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

// Mock Web3 integration types
interface BlockchainTransaction {
  id: string;
  type: 'identity_creation' | 'verification' | 'access_grant' | 'emergency_alert';
  timestamp: number;
  blockHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  gasUsed?: number;
}

interface DigitalIdentity {
  id: string;
  blockchainAddress: string;
  personalHash: string;
  verificationLevel: 'basic' | 'enhanced' | 'premium';
  createdAt: number;
  lastVerified: number;
  documentsHash: string[];
  emergencyContactsHash: string;
  biometricHash?: string;
}

interface SmartContractData {
  contractAddress: string;
  network: 'ethereum' | 'polygon' | 'hyperledger';
  verified: boolean;
  permissions: string[];
}

export function BlockchainDigitalID() {
  const [digitalIdentity, setDigitalIdentity] = useState<DigitalIdentity | null>(null);
  const [smartContract, setSmartContract] = useState<SmartContractData | null>(null);
  const [transactions, setTransactions] = useState<BlockchainTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [web3Status, setWeb3Status] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

  // Initialize blockchain integration
  useEffect(() => {
    initializeBlockchain();
    loadMockData();
  }, []);

  const initializeBlockchain = async () => {
    setIsLoading(true);
    setWeb3Status('connecting');
    
    // Simulate blockchain connection
    setTimeout(() => {
      setWeb3Status('connected');
      
      // Mock smart contract data
      setSmartContract({
        contractAddress: '0x742d35Cc6534C0532925a3b8D2C5e59a5C7a8e8F',
        network: 'polygon',
        verified: true,
        permissions: ['identity_verification', 'emergency_access', 'hotel_checkin', 'travel_document']
      });
      
      setIsLoading(false);
    }, 2000);
  };

  const loadMockData = () => {
    // Mock digital identity
    const mockIdentity: DigitalIdentity = {
      id: 'DID:TRS:8f4a9b2c1d5e6789',
      blockchainAddress: '0x8f4a9b2c1d5e6789abcdef123456789012345678',
      personalHash: 'sha256:a1b2c3d4e5f6789012345678901234567890abcdef',
      verificationLevel: 'enhanced',
      createdAt: Date.now() - 2592000000, // 30 days ago
      lastVerified: Date.now() - 86400000, // 24 hours ago
      documentsHash: [
        'sha256:passport_a1b2c3d4e5f6',
        'sha256:visa_b2c3d4e5f6a1',
        'sha256:vaccine_c3d4e5f6a1b2'
      ],
      emergencyContactsHash: 'sha256:emergency_d4e5f6a1b2c3',
      biometricHash: 'sha256:biometric_e5f6a1b2c3d4'
    };

    setDigitalIdentity(mockIdentity);

    // Mock transactions
    const mockTransactions: BlockchainTransaction[] = [
      {
        id: 'tx_001',
        type: 'identity_creation',
        timestamp: Date.now() - 2592000000,
        blockHash: '0xabcdef123456789012345678901234567890abcdef123456789012345678901234',
        status: 'confirmed',
        gasUsed: 150000
      },
      {
        id: 'tx_002',
        type: 'verification',
        timestamp: Date.now() - 86400000,
        blockHash: '0xbcdef123456789012345678901234567890abcdef1234567890123456789012345',
        status: 'confirmed',
        gasUsed: 75000
      },
      {
        id: 'tx_003',
        type: 'access_grant',
        timestamp: Date.now() - 3600000,
        blockHash: '0xcdef123456789012345678901234567890abcdef12345678901234567890123456',
        status: 'confirmed',
        gasUsed: 50000
      }
    ];

    setTransactions(mockTransactions);

    // Generate QR code data
    generateQRCode(mockIdentity);
  };

  const generateQRCode = (identity: DigitalIdentity) => {
    const qrData = JSON.stringify({
      id: identity.id,
      address: identity.blockchainAddress,
      verification: identity.verificationLevel,
      timestamp: Date.now(),
      signature: 'mock_signature_' + Math.random().toString(36).substr(2, 9)
    });
    setQrCodeData(qrData);
  };

  const initiateVerification = async () => {
    setIsLoading(true);
    setVerificationProgress(0);

    // Simulate verification process
    const steps = [
      'Generating cryptographic proof...',
      'Submitting to blockchain...',
      'Awaiting network confirmation...',
      'Updating identity record...',
      'Verification complete!'
    ];

    for (let i = 0; i < steps.length; i++) {
      setTimeout(() => {
        setVerificationProgress((i + 1) * 20);
        if (i === steps.length - 1) {
          setIsLoading(false);
          // Add new transaction
          const newTx: BlockchainTransaction = {
            id: 'tx_' + Date.now(),
            type: 'verification',
            timestamp: Date.now(),
            blockHash: '0x' + Math.random().toString(16).substr(2, 64),
            status: 'confirmed',
            gasUsed: 75000
          };
          setTransactions(prev => [newTx, ...prev]);
          
          if (digitalIdentity) {
            setDigitalIdentity({
              ...digitalIdentity,
              lastVerified: Date.now()
            });
          }
        }
      }, i * 1000);
    }
  };

  const triggerEmergencyAccess = async () => {
    setIsLoading(true);
    
    const emergencyTx: BlockchainTransaction = {
      id: 'tx_emergency_' + Date.now(),
      type: 'emergency_alert',
      timestamp: Date.now(),
      blockHash: '0x' + Math.random().toString(16).substr(2, 64),
      status: 'pending',
      gasUsed: 100000
    };

    setTransactions(prev => [emergencyTx, ...prev]);

    setTimeout(() => {
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === emergencyTx.id 
            ? { ...tx, status: 'confirmed' as const }
            : tx
        )
      );
      setIsLoading(false);
      
      alert(`🚨 EMERGENCY BLOCKCHAIN ALERT TRIGGERED

✓ Identity verified and broadcasted to emergency network
✓ Medical information and emergency contacts shared
✓ Location data transmitted to authorized responders
✓ Digital signature authenticated on blockchain
✓ Emergency access permissions activated

Transaction Hash: ${emergencyTx.blockHash}
Network: Polygon
Gas Used: ${emergencyTx.gasUsed} gwei

Your digital identity has been securely shared with emergency services.`);
    }, 3000);
  };

  const getVerificationBadge = (level: string) => {
    switch (level) {
      case 'basic':
        return <Badge className="bg-yellow-100 text-yellow-800">Basic Verified</Badge>;
      case 'enhanced':
        return <Badge className="bg-blue-100 text-blue-800">Enhanced Verified</Badge>;
      case 'premium':
        return <Badge className="bg-purple-100 text-purple-800">Premium Verified</Badge>;
      default:
        return <Badge variant="secondary">Unverified</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatHash = (hash: string) => {
    return hash.length > 20 ? `${hash.slice(0, 10)}...${hash.slice(-10)}` : hash;
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🔗 Blockchain-Secured Digital Tourist ID
        </h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Your tamper-proof, cryptographically secured digital identity powered by blockchain technology. 
          Ensuring privacy, authenticity, and instant verification for seamless travel experiences.
        </p>
      </div>

      {/* Connection Status */}
      <Alert className={`${web3Status === 'connected' ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
        <Shield className={`h-4 w-4 ${web3Status === 'connected' ? 'text-green-600' : 'text-yellow-600'}`} />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <span className={web3Status === 'connected' ? 'text-green-800' : 'text-yellow-800'}>
              {web3Status === 'connected' 
                ? '🔗 Blockchain Connected - Polygon Network' 
                : web3Status === 'connecting'
                ? '⏳ Connecting to blockchain...'
                : '⚠️ Blockchain Disconnected'
              }
            </span>
            {smartContract && (
              <Badge className="bg-purple-100 text-purple-800">
                Smart Contract: {formatHash(smartContract.contractAddress)}
              </Badge>
            )}
          </div>
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="identity" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="identity">Digital Identity</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="transactions">Blockchain History</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Access</TabsTrigger>
        </TabsList>

        {/* Digital Identity Tab */}
        <TabsContent value="identity" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Main ID Card */}
            <Card>
              <CardContent className="p-8 text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616c7e7e9de?w=150" />
                      <AvatarFallback>SC</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full text-xs font-medium flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Blockchain Verified
                  </div>
                </div>
                
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sophia Clark</h2>
                {digitalIdentity && getVerificationBadge(digitalIdentity.verificationLevel)}
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-left space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Digital ID:</span>
                      <span className="font-mono">{digitalIdentity?.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Blockchain Address:</span>
                      <span className="font-mono">{digitalIdentity && formatHash(digitalIdentity.blockchainAddress)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Network:</span>
                      <span className="text-purple-600 font-medium">Polygon</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* QR Code & Quick Access */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <QrCode className="w-5 h-5" />
                  <span>Quick Access QR</span>
                </CardTitle>
                <CardDescription>
                  Scan for instant identity verification
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="w-48 h-48 mx-auto bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="w-16 h-16 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">QR Code</p>
                    <p className="text-xs text-gray-500">Blockchain Identity</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download QR Code
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <Smartphone className="w-4 h-4 mr-2" />
                    Add to Wallet
                  </Button>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    🔒 This QR contains encrypted blockchain proof of your identity. 
                    Safe to share with verified services and authorities.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Document Hashes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Secured Documents</span>
              </CardTitle>
              <CardDescription>
                Your documents are hashed and stored securely on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    <span className="font-medium">Passport</span>
                  </div>
                  <p className="text-xs font-mono text-gray-600 break-all">
                    {digitalIdentity?.documentsHash[0]}
                  </p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    <span className="font-medium">Visa</span>
                  </div>
                  <p className="text-xs font-mono text-gray-600 break-all">
                    {digitalIdentity?.documentsHash[1]}
                  </p>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                    <span className="font-medium">Health Certificate</span>
                  </div>
                  <p className="text-xs font-mono text-gray-600 break-all">
                    {digitalIdentity?.documentsHash[2]}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Identity Verification</span>
                </CardTitle>
                <CardDescription>
                  Verify your identity on the blockchain network
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {digitalIdentity && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800">Identity Verified</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Last verified: {formatTimestamp(digitalIdentity.lastVerified)}
                    </p>
                    <p className="text-sm text-green-700">
                      Verification level: {digitalIdentity.verificationLevel}
                    </p>
                  </div>
                )}

                {isLoading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Verification Progress</span>
                      <span>{verificationProgress}%</span>
                    </div>
                    <Progress value={verificationProgress} className="w-full" />
                  </div>
                )}

                <Button 
                  onClick={initiateVerification} 
                  disabled={isLoading}
                  className="w-full"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  {isLoading ? 'Verifying...' : 'Re-verify Identity'}
                </Button>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Verification Features</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Zero-knowledge proof verification</li>
                    <li>• Biometric hash comparison</li>
                    <li>• Document authenticity check</li>
                    <li>• Multi-signature validation</li>
                    <li>• Real-time blockchain confirmation</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="w-5 h-5" />
                  <span>Smart Contract Permissions</span>
                </CardTitle>
                <CardDescription>
                  Manage your blockchain access permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {smartContract?.permissions.map((permission, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{permission.replace('_', ' ').toUpperCase()}</p>
                      <p className="text-xs text-gray-600">Blockchain-enforced permission</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                ))}

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    🔐 Permissions are managed by smart contracts and cannot be tampered with
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Blockchain History Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Blockchain Transaction History</span>
              </CardTitle>
              <CardDescription>
                Immutable record of all identity-related blockchain transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(tx.status)}
                        <div>
                          <p className="font-medium text-sm">
                            {tx.type.replace('_', ' ').toUpperCase()}
                          </p>
                          <p className="text-xs text-gray-600">
                            {formatTimestamp(tx.timestamp)}
                          </p>
                          <p className="text-xs font-mono text-gray-500">
                            Block: {formatHash(tx.blockHash)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'}>
                          {tx.status}
                        </Badge>
                        {tx.gasUsed && (
                          <p className="text-xs text-gray-600 mt-1">
                            Gas: {tx.gasUsed.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Access Tab */}
        <TabsContent value="emergency" className="space-y-6">
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <span>Emergency Blockchain Access</span>
              </CardTitle>
              <CardDescription className="text-red-700">
                Instantly share verified identity with emergency services via blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">Emergency Features</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Instant identity verification for first responders</li>
                  <li>• Medical information and allergies disclosure</li>
                  <li>• Emergency contact information sharing</li>
                  <li>• Real-time location broadcasting</li>
                  <li>• Cryptographic proof of authenticity</li>
                  <li>• Multi-signature emergency authorization</li>
                </ul>
              </div>

              <Button 
                onClick={triggerEmergencyAccess}
                disabled={isLoading}
                size="lg"
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                <AlertCircle className="w-5 h-5 mr-2" />
                {isLoading ? 'Triggering Emergency Access...' : 'TRIGGER EMERGENCY BLOCKCHAIN ACCESS'}
              </Button>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ This will immediately broadcast your verified identity and emergency information 
                  to authorized responders via blockchain. Only use in genuine emergencies.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contacts (Hashed)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Primary Contact</Label>
                  <p className="font-medium">Ethan Carter (Father)</p>
                  <p className="text-sm text-gray-600">+1-555-123-4567</p>
                </div>
                <div>
                  <Label>Secondary Contact</Label>
                  <p className="font-medium">Olivia Carter (Mother)</p>
                  <p className="text-sm text-gray-600">+1-555-765-4321</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    Contact information is encrypted and hashed on blockchain for privacy
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Medical Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Blood Type</Label>
                  <p className="font-medium">O+ Positive</p>
                </div>
                <div>
                  <Label>Allergies</Label>
                  <p className="font-medium">Penicillin, Shellfish</p>
                </div>
                <div>
                  <Label>Medical Conditions</Label>
                  <p className="font-medium">None reported</p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-800">
                    Medical data hash: {digitalIdentity?.emergencyContactsHash && formatHash(digitalIdentity.emergencyContactsHash)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Contactless Access Button */}
      <div className="text-center">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 text-lg"
        >
          <Shield className="w-6 h-6 mr-3" />
          Contactless Blockchain Check-In / Access
        </Button>
        <p className="text-sm text-gray-600 mt-2">
          Powered by smart contracts • Zero-knowledge verification • Privacy-first design
        </p>
      </div>
    </div>
  );
}