window.billReceiveListComponent = Vue.extend({
    template: `
        <style type="text/css">
            .pago{
                color: green;
            }
            .nao-pago{
                color: red;
            }
        </style>
        <table border="1" cellpadding="10">
            <thead>
            <tr>
                <th>#</th>
                <th>Vencimento</th>
                <th>Nome</th>
                <th>Valor</th>
                <th>Recebido?</th>
                <th>Ações</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(index,o) in bills">
                <td>{{ index + 1 }}</td>
                <td>{{ o.date_due | dateFormat 'pt-BR' }}</td>
                <td>{{ o.name | textCaseFormat }}</td>
                <td>{{ o.value | numberFormat 'pt-BR' 'BRL' }}</td>
                <td class="minha-classe" :class="{'pago': o.done, 'nao-pago': !o.done}">
                    {{ o.done | doneLabelReceive }}
                </td>
                <td>
                    <a v-link="{ name: 'bill-receive.update', params: {id: o.id} }">Editar</a> |
                    <a href="#" @click.prevent="deleteBill(o)">Excluir</a>
                </td>
            </tr>
            </tbody>
        </table>
    `,
    data() {
        return {
            bills: []
        };
    },
    created() {
        BillReceive.query().then((response) => {
            this.bills = response.data;
        });
    },
    methods: {
        deleteBill(bill) {
            let ok = confirm("Você confirma a exclusão da conta "+bill.name+" de "+bill.date_due);
            if(ok == true){
                BillReceive.delete({id: bill.id}).then((response) => {
                    this.bills.$remove(bill);
                    this.$dispatch('change-info');
                });
            }
        }
    },
    events: {
    }
});