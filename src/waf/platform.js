const _platforms = {
		'kswepic-tv' : {
			resourceGroupName : 'KSWEpic',
			subscriptionId : '572d4b09-73d1-4c5c-9f8e-3cf8cb2340c0',			
			resources:{
				FrontDoorWAFPolicy:{
					templateFile:'src/waf/data/kswepic-tv/templates/wafTemplate.json',
					parameters:{
						wafName:'kswepicWAFPowerful',
						wafSKU:'Premium_AzureFrontDoor',
						platformApiHost:'api.kswepic.tv',
					}
				}
			},

		},
		'stb-kswepic-tv' : {
			resourceGroupName : 'KSWEpic',
			subscriptionId : '572d4b09-73d1-4c5c-9f8e-3cf8cb2340c0',			
			resources:{
				FrontDoorWAFPolicy:{
					templateFile:'src/waf/data/stb-kswepic-tv/templates/wafTemplate.json',
					parameters:{
						wafName:'stbKswEpicWAFPowerful',
						wafSKU:'Premium_AzureFrontDoor',
						platformApiHost:'cpstb-api-kswepic-tv.streamonline.biz',
					}
				}
			},

		},
		'kswepic-tv-surveys' : {
			resourceGroupName : 'KSWEpic',
			subscriptionId : '572d4b09-73d1-4c5c-9f8e-3cf8cb2340c0',			
			resources:{
				FrontDoorWAFPolicy:{
					templateFile:'src/waf/data/kswepic-tv-surveys/templates/wafTemplate.json',
					parameters:{
						wafName:'kswepicSurveysWAFPowerful',
						wafSKU:'Premium_AzureFrontDoor',
						platformApiHost:'api-surveys.kswepic.tv',
					}
				}
			},

		},
		'bo-kswepic-tv' : {
			resourceGroupName : 'KSWEpic',
			subscriptionId : '572d4b09-73d1-4c5c-9f8e-3cf8cb2340c0',			
			resources:{
				FrontDoorWAFPolicy:{
					templateFile:'src/waf/data/bo-kswepic-tv/templates/wafTemplate.json',
					parameters:{
						wafName:'backofficeKswepicWAFPowerful',
						wafSKU:'Premium_AzureFrontDoor',
						platformApiHost:'api-bo.kswepic.tv',
					}
				}
			},

		},
		'mediaportal' : {
			resourceGroupName : 'MediaPortal',
			subscriptionId : '761e85b6-1f88-4b5f-9968-bad0ef9106f8',			
			resources:{
				FrontDoorWAFPolicy:{
					templateFile:'src/waf/data/mediaportal/templates/wafTemplate.json',
					parameters:{
						wafName:'mediaportalWAFPowerful',
						wafSKU:'Premium_AzureFrontDoor',
						platformApiHost:'api-mediaportal-eagfdaaqhycgdtcp.z01.azurefd.net',
					}
				}
			},

		},'stonagrod-pl' : {
			resourceGroupName : '100-Nagrod',
			subscriptionId : '47ea1b52-8227-4cee-907d-0fa60dbe17c1',			
			resources:{
				FrontDoorWAFPolicy:{
					templateFile:'src/waf/data/stonagrod-pl/templates/wafTemplate.json',
					parameters:{
						wafName:'stoWAFPowerful',
						wafSKU:'Premium_AzureFrontDoor',
						platformApiHost:'api.100nagrod.pl',
					}
				}
			},

		},
		'mgpgarage-pl' : {
			resourceGroupName : 'MGPGarage',
			subscriptionId : '6e62309a-8a8b-42d4-b849-45a93412c035',			
			resources:{
				FrontDoorWAFPolicy:{
					templateFile:'src/waf/data/mgpgarage-pl/templates/wafTemplate.json',
					parameters:{
						wafName:'mgpgarageWAFPowerful',
						wafSKU:'Premium_AzureFrontDoor',
						platformApiHost:'api.mgp-garage.pl',
					}
				}
			},

		},
		'famemma-tv' : {
			resourceGroupName : 'FameMMA',
			subscriptionId : '6e9f7867-35ab-40f8-ab01-cc5fcfce772d',			
			resources:{
				FrontDoorWAFPolicy:{
					templateFile:'src/waf/data/famemma-tv/templates/wafTemplate.json',
					parameters:{
						wafName:'famemmaWAFPowerful',
						wafSKU:'Premium_AzureFrontDoor',
						platformApiHost:'api.famemma.tv',
					}
				}
			},

		},
		'cloutmma-tv' : {
			resourceGroupName : 'CloutMMA',
			subscriptionId : 'aaf89f9c-4ade-4298-8388-206db0d791b3',			
			resources:{
				FrontDoorWAFPolicy:{
					templateFile:'src/waf/data/cloutmma-tv/templates/wafTemplate.json',
					parameters:{
						wafName:'cloutmmaWAFPowerful',
						wafSKU:'Premium_AzureFrontDoor',
						platformApiHost:'api.cloutmma.tv',
					}
				}
			},

		},
		'playlive-net' : {
			resourceGroupName : 'PLAYLIVE',
			subscriptionId : 'f57679b9-e171-4c44-8525-d7d9470c78b5',			
			resources:{
				FrontDoorWAFPolicy:{
					templateFile:'src/waf/data/playlive-net/templates/wafTemplate.json',
					parameters:{
						wafName:'playlivePowerfulWAF',
						wafSKU:'Premium_AzureFrontDoor',
						platformApiHost:'api.playlive.net',
					}
				}
			},
		},
		'movefederation-tv' : {
			resourceGroupName : 'MoveFederation',
			subscriptionId : 'c5d48fa8-d0c4-455e-8224-8fe6e6588e2f',			
			resources:{
				FrontDoorWAFPolicy:{
					templateFile:'src/waf/data/movefederation-tv/templates/wafTemplate.json',
					parameters:{
						wafName:'moveWAFPowerful',
						wafSKU:'Premium_AzureFrontDoor',
						platformApiHost:'api.move-federation.tv'
					}
				}
			},

		},
		'gromda-tv' : {
			resourceGroupName : 'Gromda',
			subscriptionId : 'daeb521a-f7b1-41ad-b01c-5f2f0c039893',
			resources:{
				FrontDoorWAFPolicy:{
					templateFile:'src/waf/data/gromda-tv/templates/wafTemplate.json',
					parameters:{
						wafName:'gromdaWAFPowerful',
						wafSKU:'Premium_AzureFrontDoor',
						platformApiHost:'api.gromda.tv',

					}
				}
			},
			wafName : 'gromdaWAF'
		},				
		'clash-tv' : {
			resourceGroupName : 'ClashOfTheStars',
			subscriptionId : 'c970a8f9-f50d-42f0-b92e-baa2e6b537af',
			// wafName : 'clashWAF',
			resources:{
				FrontDoorWAFPolicy:{
					templateFile:'src/waf/data/clash-tv/templates/wafTemplate.json',
					parameters:{
						wafName : 'mediaportalClashWAF',
						wafSKU:'Premium_AzureFrontDoor',
						platformApiHost:'api.clashofthestars.tv',
					}
				}
			},
		},
		'primemma-tv' : {
			resourceGroupName : 'PrimeMMA',
			subscriptionId : 'bbac4a90-0657-4c02-94cb-61caa3046671',
			resources:{
				FrontDoorWAFPolicy:{
					templateFile:'src/waf/data/primemma-tv/templates/wafTemplate.json',
					parameters:{
						wafName : 'primeWAFPowerful',
						wafSKU:'Premium_AzureFrontDoor',
						platformApiHost:'api.primemma.tv',
					}
				}
			},
		},
		'bo-primemma-tv' : {
			resourceGroupName : 'PrimeMMA',
			subscriptionId : 'bbac4a90-0657-4c02-94cb-61caa3046671',
			resources:{
				FrontDoorWAFPolicy:{
					templateFile:'src/waf/data/bo-primemma-tv/templates/wafTemplate.json',
					parameters:{
						wafName : 'backofficePrimeWAFPowerful',
						wafSKU:'Premium_AzureFrontDoor',
						platformApiHost:'api-bo.primemma.tv',
					}
				}
			},
		},

	}

	const platformId = process.argv[2] ? process.argv[2].toLowerCase() : false;
    const platform = _platforms[ platformId ];


module.exports = { platformId, platform }