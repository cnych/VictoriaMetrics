import {InstantMetricResult, MetricBase, MetricResult} from "../api/types";
import {ErrorTypes} from "../types";
import {useAppState} from "../state/common/StateContext";
import {useCallback, useEffect, useMemo, useState} from "preact/compat";
import {DisplayType} from "../components/CustomPanel/Configurator/DisplayTypeSwitch";
import throttle from "lodash.throttle";
// data-params='{"serverURL": "https://play.victoriametrics.com/select/accounting/1/6a716b0f-38bc-4856-90ce-448fd713e3fe/prometheus/"}'
import {getCardinalityInfo} from "../api/tsdb";
import {isValidHttpUrl} from "../utils/url";
import {CustomStep} from "../state/graph/reducer";
import {getAppModeEnable, getAppModeParams} from "../utils/app-mode";

interface FetchQueryParams {
  visible: boolean
}

const appModeEnable = getAppModeEnable();
const {serverURL: appServerUrl} = getAppModeParams();

export const useFetchQuery = ({visible}: FetchQueryParams): {
  fetchUrl?: string[],
  isLoading: boolean,
  error?: ErrorTypes | string
} => {
  const {serverUrl, queryControls: {nocache}} = useAppState();

  // const [queryOptions, setQueryOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [graphData, setGraphData] = useState<MetricResult[]>();
  // const [liveData, setLiveData] = useState<InstantMetricResult[]>();
  const [error, setError] = useState<ErrorTypes | string>();
  const [fetchQueue, setFetchQueue] = useState<AbortController[]>([]);

  useEffect(() => {
    if (error) {
      // setGraphData(undefined);
      // setLiveData(undefined);
      console.log("got error =>", error);
    }
  }, [error]);

  // const throttledFetchData = useCallback(throttle(fetchData, 1000), []);


  const fetchCardinalityInfo = async () => {
    const server = appModeEnable ? appServerUrl : serverUrl;
    if (!server) return;
    const url = getCardinalityInfo(server);

    console.log("url =>", url);
    try {
      const response = await fetch(url);
      const resp = await response.json();
      console.log("resp =>", resp);
      if (response.ok) {
        console.log(resp.data);
        // setQueryOptions(resp.data);
      }
    } catch (e) {
      if (e instanceof Error) setError(`${e.name}: ${e.message}`);
    }
  };

  // const fetchUrl = useMemo(() => {
  //     const server = appModeEnable ? appServerUrl : serverUrl;
  //     const expr = predefinedQuery ?? query;
  //     const displayChart = (display || displayType) === "chart";
  //     if (!period) return;
  //     if (!server) {
  //       setError(ErrorTypes.emptyServer);
  //     } else if (expr.every(q => !q.trim())) {
  //       setError(ErrorTypes.validQuery);
  //     } else if (isValidHttpUrl(server)) {
  //       const updatedPeriod = {...period};
  //       if (customStep.enable) updatedPeriod.step = customStep.value;
  //       return expr.filter(q => q.trim()).map(q => displayChart
  //         ? getQueryRangeUrl(server, q, updatedPeriod, nocache)
  //         : getQueryUrl(server, q, updatedPeriod));
  //     } else {
  //       setError(ErrorTypes.validServer);
  //     }
  //   },
  //   [serverUrl, period, displayType, customStep]);


  useEffect(() => {
    fetchCardinalityInfo();
  }, [serverUrl]);

  // return { fetchUrl, isLoading, graphData, liveData, error, queryOptions: queryOptions };
  return {isLoading};
};