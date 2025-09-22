import * as React from "react";
import styles from "./Ssdl.module.scss";
import { ISsdlProps } from "./ISsdlProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { sp } from "@pnp/sp/presets/all";
import MainComponent from "./MainComponent";
export default class Ssdl extends React.Component<ISsdlProps, {}> {
  constructor(prop: ISsdlProps) {
    super(prop);
    sp.setup({
      spfxContext: this.props.context,
    });
  }

  public render(): React.ReactElement<ISsdlProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
    } = this.props;

    return (
      <MainComponent context={this.context} display={this.props.displayMode} />
    );
  }
}
