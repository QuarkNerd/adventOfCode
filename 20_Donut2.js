{
    var input = '{"SXO":{"ENI":56},"UYO":{"XII":56},"AAO":{"RUO":6,"KHI":50},"RUO":{"AAO":6,"KHI":54},"GTO":{"RFI":72},"VMO":{"XBI":48},"BYO":{"VMI":58},"LGO":{"WDI":52},"ENI":{"SXO":56},"XII":{"UYO":56},"KHI":{"AAO":50,"RUO":54},"RFI":{"GTO":72},"XBI":{"VMO":48},"VMI":{"BYO":58},"WDI":{"LGO":52},"UOI":{"HVO":80},"QAI":{"MBO":58,"ZZO":60},"MBO":{"QAI":58,"ZZO":8},"HVO":{"UOI":80},"ZZO":{"QAI":60,"MBO":8},"YXO":{"GTI":56},"GTI":{"YXO":56},"XIO":{"AOI":78},"AOI":{"XIO":78},"WDO":{"MBI":54},"AOO":{"PII":54},"MBI":{"WDO":54},"PII":{"AOO":54},"UYI":{"ZYO":48,"HVI":4,"OQO":52},"ZYO":{"UYI":48,"HVI":46,"OQO":6},"HVI":{"UYI":4,"ZYO":46,"OQO":50},"RUI":{"PIO":54},"PIO":{"RUI":54},"OQO":{"UYI":52,"ZYO":6,"HVI":50},"OQI":{"WAO":58},"WAO":{"OQI":58},"UOO":{"SXI":74},"SXI":{"UOO":74},"BYI":{"RFO":48},"WAI":{"KHO":52},"RFO":{"BYI":48},"TRI":{"XBO":44},"XBO":{"TRI":44},"KHO":{"WAI":52},"ZYI":{"MWO":54},"MWI":{"TRO":54},"YXI":{"PSO":52},"MDI":{"QAO":44},"PSI":{"MDO":50},"LGI":{"ENO":56},"MWO":{"ZYI":54},"TRO":{"MWI":54},"PSO":{"YXI":52},"QAO":{"MDI":44},"MDO":{"PSI":50},"ENO":{"LGI":56}}';
    var matrix = JSON.parse(input);
    console.log(matrix.get("SXO").get("ENI"));
}
