import _ from "lodash";
import $ from "jquery";

import { State } from "../engine/object";
import { Rect } from "shared/math";

import { Sprite, Text } from "../engine/wrapper";
import { Layer } from "../engine/object";

import Popup from "../ui/popup";
import Message from "../engine/message";

import { Button } from "../ui/button";
import TextBox from "../ui/textbox";
import Table from "../ui/table";
import ListBox from "../ui/listbox";

import Client from "../multiplayer/client";

/**
 * Setting nick and connecting to server
 * @class
 */
export default class Boot extends State {
  /** @inheritdoc */
  init() {
    this.add(
      new Text(
        new Rect(this.rect.w / 2 - 130, this.rect.h - 64, 400, 48),
        "HackBall"
      )
    );
    this.showPopup(new Boot.ConnectPopup());
  }
}

Boot.ConnectPopup = class extends Popup {
  constructor() {
    super(Layer.GridBox(2, 6), new Rect(0, 0, 370, 200), "Host configuration");
  }

  /**
   * Connects to host after clicking connect
   * @private
   */
  _connectToHost() {
    let selectedServers = this.serverList.listbox.selected;
    Client.connect(selectedServers ? selectedServers[1] : this.ip.text)
      .then(() => Client.emit("setNick", this.nick.text))
      .then(() => {
        Client.user.nick = this.nick.text;
        this.canvas.openSocketListeners().setState("roomList").reloadRoomList();
      })

      .catch((message) => Popup.confirm(this, message));
  }

  /** @inheritdoc */
  init() {
    // Server address
    this.add(new Text(new Rect(0, 0, 0, 14), "Host:"));
    this.ip = this.add(new TextBox(new Rect(0, 0, 0, 16), "127.0.0.1"), {
      fill: [0.5, 0.0],
    }).addForwarder(Message.Type.MOUSE_CLICK, () => {
      this.serverList.listbox.deselect();
    });

    // Nick field
    this.add(new Text(new Rect(0, 0, 0, 14), "Your nick:"));
    this.nick = this.add(
      new TextBox(new Rect(0, 0, 0, 16), `Player${_.random(0, 10000)}`),
      { fill: [0.5, 0.0] }
    );

    this.add(new Button(new Rect(0, 0, 118, 16), "Connect!"), {
      expand: 2,
    }).addForwarder(Message.Type.MOUSE_CLICK, this._connectToHost.bind(this));

    // Options panel
    this.serverList = this.add(
      new Table(
        [
          [
            "",
            0.07,
            (column) => new ListBox.ImageItem(`res/flags/${column}.png`),
          ],
          ["IP", 0.5],
          ["City", 0.43],
        ],
        new Rect(0, 0, 0, 100)
      ),
      { fill: [1, 0] }
    );
  }
};
